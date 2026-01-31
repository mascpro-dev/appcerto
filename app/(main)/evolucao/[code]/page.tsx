"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { ArrowLeft, Play, Loader2, Save, History } from "lucide-react";
import Link from "next/link";

export default function AulaPlayerPage() {
  const params = useParams();
  const supabase = createClientComponentClient();
  const courseCode = params?.code as string;

  // Dados da Aula
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Memória e Dinheiro
  const [sessionSeconds, setSessionSeconds] = useState(0); // Tempo desta sessão (para pagar)
  const [videoStartSeconds, setVideoStartSeconds] = useState(0); // Onde o vídeo deve começar
  const [currentVideoTime, setCurrentVideoTime] = useState(0); // Tempo atual (para salvar)
  const [isReady, setIsReady] = useState(false); // Só mostra o vídeo quando souber onde começar

  // 1. CARREGAR AULAS DO MÓDULO
  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("lessons")
          .select("*")
          .ilike("course_code", courseCode) 
          .order("sequence_order", { ascending: true });

        if (data && data.length > 0) {
          setLessons(data);
          setCurrentLesson(data[0]); // Começa pela primeira (o useEffect abaixo vai ajustar o tempo)
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }
    if (courseCode) fetchLessons();
  }, [courseCode, supabase]);

  // 2. SISTEMA DE MEMÓRIA (Ao trocar de aula, descobre onde parou)
  useEffect(() => {
    async function loadMemory() {
        if (!currentLesson) return;
        
        // Trava o vídeo enquanto busca a memória (para não começar do zero sem querer)
        setIsReady(false);
        setSessionSeconds(0);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from("lesson_progress")
                .select("seconds_watched")
                .eq("user_id", user.id)
                .eq("lesson_id", currentLesson.id)
                .single();
            
            // Se já assistiu antes, pega o tempo. Se não, começa do 0.
            const savedTime = data?.seconds_watched || 0;
            
            console.log(`🧠 Memória carregada: Aula ${currentLesson.title} começa em ${savedTime}s`);
            
            setVideoStartSeconds(savedTime);
            setCurrentVideoTime(savedTime);
            setIsReady(true); // Libera o player
        }
    }
    loadMemory();
  }, [currentLesson, supabase]);

  // 3. RELÓGIO INTELIGENTE (Roda a cada 1 segundo)
  useEffect(() => {
    if (!currentLesson || !isReady) return;

    const interval = setInterval(() => {
      // Conta tempo para ganhar dinheiro (Sessão atual)
      setSessionSeconds((prev) => {
        const novo = prev + 1;
        if (novo > 0 && novo % 600 === 0) pagarRecompensa(); // Paga a cada 10 min (600s)
        return novo;
      });

      // Conta tempo do vídeo para salvar (Histórico)
      setCurrentVideoTime((prev) => prev + 1);

    }, 1000);

    return () => clearInterval(interval);
  }, [currentLesson, isReady]);

  // 4. SALVAMENTO AUTOMÁTICO (A cada 5 segundos)
  // Salva no banco onde você está, para se a luz acabar, você não perder nada.
  useEffect(() => {
    if (!currentLesson || !isReady) return;

    const saveInterval = setInterval(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && currentVideoTime > 0) {
            await supabase.from("lesson_progress").upsert({
                user_id: user.id,
                lesson_id: currentLesson.id,
                seconds_watched: currentVideoTime,
                last_updated: new Date().toISOString()
            });
        }
    }, 5000); // Salva a cada 5s (mais preciso)

    return () => clearInterval(saveInterval);
  }, [currentVideoTime, currentLesson, supabase]);

  async function pagarRecompensa() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.rpc('reward_watch_time_v2', { user_id: user.id });
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#C9A66B]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      
      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/evolucao" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">VOLTAR</span>
        </Link>
        
        {/* Indicadores */}
        <div className="flex items-center gap-4">
            {isReady && videoStartSeconds > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-500 font-bold animate-in fade-in">
                    <History size={12} /> 
                    Retomando de {Math.floor(videoStartSeconds / 60)}min
                </div>
            )}
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <Save size={10} /> {Math.floor(currentVideoTime / 60)}min salvos
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- PLAYER LIMPO (SEM MÁSCARAS) --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#222] shadow-2xl shadow-black">
            
            {/* LÓGICA DO IFRAME LIMPO:
                - controls=1: Permite volume e tela cheia (o que você pediu)
                - modestbranding=1: Tenta reduzir o logo do YouTube
                - rel=0: Evita vídeos de canais aleatórios no final
                - start=X: A MÁGICA. Começa do segundo exato do banco.
            */}
            
            {isReady ? (
                <iframe 
                    key={`${currentLesson.id}-${videoStartSeconds}`} // Força recarregar se mudar de aula
                    src={`https://www.youtube.com/embed/${currentLesson.video_id}?start=${videoStartSeconds}&autoplay=1&mute=0&modestbranding=1&rel=0&controls=1&showinfo=0&iv_load_policy=3&fs=1`}
                    title="Player MASC PRO"
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen 
                />
            ) : (
                // Tela de carregamento enquanto busca a memória
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] text-gray-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C9A66B]" />
                    <p className="text-xs font-bold uppercase tracking-widest">Sincronizando Memória...</p>
                </div>
            )}

          </div>

          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-white">{currentLesson?.title}</h1>
                <p className="text-gray-500 text-sm mt-1">
                Tempo nesta sessão: <span className="text-[#C9A66B] font-bold">{Math.floor(sessionSeconds / 60)} min</span>
                </p>
            </div>
          </div>
        </div>

        {/* LISTA LATERAL */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 h-fit">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
            Neste Módulo
          </h3>
          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const isActive = lesson.id === currentLesson?.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    // Reset visual para o usuário sentir que mudou
                    setIsReady(false); 
                    setCurrentLesson(lesson);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all border ${
                    isActive 
                      ? "bg-[#C9A66B]/10 border-[#C9A66B]/40" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-[#C9A66B] text-black" : "bg-[#222] text-gray-500"
                  }`}>
                    {isActive ? <Play size={10} fill="currentColor" /> : index + 1}
                  </div>
                  <p className={`text-sm font-bold leading-tight ${isActive ? "text-white" : "text-gray-400"}`}>
                    {lesson.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

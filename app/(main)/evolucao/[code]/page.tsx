"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { ArrowLeft, Play, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function AulaPlayerPage() {
  const params = useParams();
  const supabase = createClientComponentClient();
  const courseCode = params?.code as string;

  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Timer de Sessão (Dinheiro)
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Timer de Progresso (Memória do Vídeo)
  const [videoStartSeconds, setVideoStartSeconds] = useState(0); 
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);

  // 1. Busca Aulas
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
          // Define a primeira aula como inicial
          setCurrentLesson(data[0]);
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }
    if (courseCode) fetchLessons();
  }, [courseCode, supabase]);

  // 2. Ao carregar a aula, busca no banco onde parou
  useEffect(() => {
    async function loadProgress() {
        if (!currentLesson) return;
        
        setIsReadyToPlay(false); // Segura o vídeo enquanto busca
        setSessionSeconds(0);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from("lesson_progress")
                .select("seconds_watched")
                .eq("user_id", user.id)
                .eq("lesson_id", currentLesson.id)
                .single();
            
            const savedTime = data?.seconds_watched || 0;
            setVideoStartSeconds(savedTime);
            setCurrentVideoTime(savedTime);
            setIsReadyToPlay(true); // Libera o player com o tempo certo
        }
    }
    loadProgress();
  }, [currentLesson, supabase]);

  // 3. Relógio (Conta tempo para dinheiro e progresso)
  useEffect(() => {
    if (!currentLesson || !isReadyToPlay) return;

    const interval = setInterval(() => {
      // Dinheiro (Sessão)
      setSessionSeconds((prev) => {
        const novo = prev + 1;
        if (novo > 0 && novo % 900 === 0) pagarRecompensa(); 
        return novo;
      });

      // Progresso (Total Vídeo)
      setCurrentVideoTime((prev) => prev + 1);

    }, 1000);

    return () => clearInterval(interval);
  }, [currentLesson, isReadyToPlay]);

  // 4. Salva no banco a cada 10 segundos
  useEffect(() => {
    if (!currentLesson) return;
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
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [currentVideoTime, currentLesson, supabase]);

  async function pagarRecompensa() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Chama a função V2 que criamos (com regras novas)
      await supabase.rpc('reward_watch_time_v2', { user_id: user.id });
      console.log("💰 Dinheiro pago!");
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#C9A66B]" />
    </div>
  );

  if (!currentLesson) return (
    <div className="min-h-screen bg-[#0A0A0A] p-10 text-white text-center">
        <h2 className="text-xl font-bold mb-2">Aula indisponível.</h2>
        <Link href="/evolucao" className="text-[#C9A66B] hover:underline">Voltar</Link>
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
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <Save size={10} /> {Math.floor(currentVideoTime / 60)}min salvos
             </div>
            <div className="bg-[#C9A66B]/10 text-[#C9A66B] border border-[#C9A66B]/30 px-4 py-1.5 rounded text-xs font-bold tracking-widest animate-pulse">
            VALENDO PRO
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ÁREA DO PLAYER (BLINDADA) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#222] shadow-2xl shadow-black group">
            
            {/* --- AS TRAVAS DE SEGURANÇA VOLTARAM --- */}
            {/* 1. Máscara Superior: Bloqueia clique no Título do vídeo */}
            <div className="absolute inset-x-0 top-0 h-16 z-20 bg-transparent" />
            
            {/* 2. Máscara Inferior Esquerda: Bloqueia logo do YouTube, mas deixa o Play/Volume livres se possível, 
                   ou cobre tudo exceto Tela Cheia. Ajustei para cobrir canto esquerdo inferior. */}
            <div className="absolute left-0 bottom-10 w-20 h-16 z-20 bg-transparent" />

            {/* IFRAME INTELIGENTE */}
            {/* O segredo: 'key' força recarregar quando o tempo muda */}
            {isReadyToPlay && (
                <iframe 
                key={`${currentLesson.id}-${videoStartSeconds}`} 
                src={`https://www.youtube.com/embed/${currentLesson.video_id}?start=${videoStartSeconds}&autoplay=1&mute=0&modestbranding=1&rel=0&controls=1&showinfo=0&fs=1&iv_load_policy=3&disablekb=1`}
                title="Player MASC PRO"
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen 
                />
            )}
            {!isReadyToPlay && (
                <div className="w-full h-full flex items-center justify-center bg-black text-gray-500">
                    <Loader2 className="animate-spin" />
                </div>
            )}

          </div>

          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-white">{currentLesson.title}</h1>
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
              const isActive = lesson.id === currentLesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    // Reset total ao mudar de aula
                    setIsReadyToPlay(false);
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

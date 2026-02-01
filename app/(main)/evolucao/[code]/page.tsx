"use client";

import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Save, History } from "lucide-react";
import Link from "next/link";
import "plyr/dist/plyr.css"; // CSS Original do Plyr

export default function AulaPlayerPage() {
  const params = useParams();
  const supabase = createClientComponentClient();
  const courseCode = params?.code as string;

  // Refs e Estados
  const playerInstance = useRef<any>(null); // Guarda o player na memória
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Lógica de Negócio
  const [sessionSeconds, setSessionSeconds] = useState(0); 
  const [savedTime, setSavedTime] = useState(0); 
  const [hasJumped, setHasJumped] = useState(false);

  // 1. CARREGAR AULAS
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

  // 2. CARREGAR MEMÓRIA DO BANCO
  useEffect(() => {
    async function loadMemory() {
        if (!currentLesson) return;
        setHasJumped(false);
        setSessionSeconds(0);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from("lesson_progress")
                .select("seconds_watched")
                .eq("user_id", user.id)
                .eq("lesson_id", currentLesson.id)
                .single();
            
            const time = data?.seconds_watched || 0;
            setSavedTime(time);
        }
    }
    loadMemory();
  }, [currentLesson, supabase]);

  // 3. INICIAR O PLAYER (MODO MANUAL)
  useEffect(() => {
    if (!currentLesson) return;

    // Importação dinâmica dentro do Effect para não quebrar no servidor
    let player: any = null;
    const loadPlayer = async () => {
        // Importa a lógica do Plyr apenas no navegador
        const Plyr = (await import("plyr")).default;

        // Destrói player anterior se existir (para não duplicar)
        if (playerInstance.current) {
            playerInstance.current.destroy();
        }

        // Cria o novo player
        player = new Plyr("#player-target", {
            autoplay: true,
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }
        });

        playerInstance.current = player;

        // EVENTOS DO PLAYER
        
        // Quando estiver pronto, pula para o tempo salvo
        player.on('ready', () => {
            if (savedTime > 0) {
                // Pequeno delay para garantir que o YouTube carregou
                setTimeout(() => {
                    player.currentTime = savedTime;
                    setHasJumped(true);
                }, 1000); 
            }
        });

        // A cada atualização de tempo (timeupdate roda várias vezes por segundo)
        player.on('timeupdate', (event: any) => {
            const currentTime = event.detail.plyr.currentTime;
            
            // Salvar no Banco a cada 5s (aprox)
            if (Math.floor(currentTime) % 5 === 0 && currentTime > 0) {
                 salvarProgresso(currentTime);
            }
        });

        // Contar tempo de sessão (Dinheiro) - Usamos um intervalo separado para não depender do vídeo
    };

    loadPlayer();

    // Cleanup ao sair da página
    return () => {
        if (playerInstance.current) playerInstance.current.destroy();
    };
  }, [currentLesson, savedTime]); // Recria se mudar a aula ou carregar nova memória

  // 4. RELÓGIO DE SESSÃO (Dinheiro)
  useEffect(() => {
      if (!currentLesson) return;
      const interval = setInterval(() => {
          const player = playerInstance.current;
          if (player && player.playing) {
              setSessionSeconds(prev => {
                  const novo = prev + 1;
                  if (novo > 0 && novo % 600 === 0) pagarRecompensa();
                  return novo;
              });
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [currentLesson]);


  // FUNÇÕES AUXILIARES
  const salvarProgresso = async (time: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from("lesson_progress").upsert({
            user_id: user.id,
            lesson_id: currentLesson.id,
            seconds_watched: Math.floor(time),
            last_updated: new Date().toISOString()
        });
    }
  };

  async function pagarRecompensa() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.rpc('reward_watch_time_v2', { user_id: user.id });
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#C9A66B]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      
      {/* CSS DO PLAYER DOURADO */}
      <style jsx global>{`
        :root { --plyr-color-main: #C9A66B; }
        .plyr--full-ui input[type=range] { color: #C9A66B; }
        .plyr__control--overlaid { background: rgba(201, 166, 107, 0.9); }
        .plyr--video { border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        /* Remove clique do iframe do youtube para forçar uso da interface Plyr */
        .plyr__video-embed iframe { pointer-events: none; }
      `}</style>

      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/evolucao" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">VOLTAR</span>
        </Link>
        <div className="flex items-center gap-4">
            {hasJumped && (
                <div className="flex items-center gap-1 text-xs text-green-500 font-bold animate-in fade-in">
                    <History size={12} /> Retomando
                </div>
            )}
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <Save size={10} /> Auto-save
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- ÁREA DO VÍDEO --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-black rounded-xl shadow-2xl shadow-black relative z-10">
            {currentLesson ? (
                // O SEGREDO: Uma div simples que o Plyr vai "possuir" depois
                <div className="plyr__video-embed" id="player-target">
                    <iframe
                        src={`https://www.youtube.com/embed/${currentLesson.video_id}?origin=https://plyr.io&iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`}
                        allowFullScreen
                        allow="autoplay"
                    ></iframe>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Selecione uma aula
                </div>
            )}
          </div>

          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-white">{currentLesson?.title}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Tempo de sessão: <span className="text-[#C9A66B] font-bold">{Math.floor(sessionSeconds / 60)} min</span>
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
                    setHasJumped(false);
                    setCurrentLesson(lesson);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all border ${
                    isActive ? "bg-[#C9A66B]/10 border-[#C9A66B]/40" : "bg-transparent border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-[#C9A66B] text-black" : "bg-[#222] text-gray-500"
                  }`}>
                    {isActive ? "▶" : index + 1}
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

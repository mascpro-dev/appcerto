"use client";

import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Save, History } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "plyr-react/plyr.css";

// --- A CORREÇÃO FINAL ESTÁ AQUI ---
// Adicionamos "as any" no final. Isso força o TypeScript a aceitar o "ref" no componente.
const Plyr = dynamic(
  () => import("plyr-react").then((mod: any) => mod.default),
  { ssr: false }
) as any;

export default function AulaPlayerPage() {
  const params = useParams();
  const supabase = createClientComponentClient();
  const courseCode = params?.code as string;

  // Refs e Estados
  const playerRef = useRef<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Lógica de Negócio
  const [sessionSeconds, setSessionSeconds] = useState(0); 
  const [savedTime, setSavedTime] = useState(0); 
  const [hasJumpedToTime, setHasJumpedToTime] = useState(false);

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

  // 2. CARREGAR MEMÓRIA
  useEffect(() => {
    async function loadMemory() {
        if (!currentLesson) return;
        setHasJumpedToTime(false);
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

  // 3. MONITORAR O VÍDEO
  useEffect(() => {
    if (!currentLesson) return;

    const interval = setInterval(async () => {
        // Acessa o player interno com segurança
        const player = playerRef.current?.plyr;
        
        if (player) {
            // A. PULO INICIAL (Memória)
            // Tenta pular assim que o vídeo tiver duração válida
            if (!hasJumpedToTime && savedTime > 0 && player.duration > 0) {
                player.currentTime = savedTime;
                setHasJumpedToTime(true);
            } else if (savedTime === 0) {
                setHasJumpedToTime(true);
            }

            // B. SALVAR NO BANCO (A cada 5s)
            const currentTime = player.currentTime;
            if (player.playing && Math.floor(currentTime) % 5 === 0 && currentTime > 0) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from("lesson_progress").upsert({
                        user_id: user.id,
                        lesson_id: currentLesson.id,
                        seconds_watched: Math.floor(currentTime),
                        last_updated: new Date().toISOString()
                    });
                }
            }

            // C. DINHEIRO (Sessão)
            if (player.playing) {
                setSessionSeconds(prev => {
                    const novo = prev + 1;
                    if (novo > 0 && novo % 600 === 0) { 
                         pagarRecompensa(); 
                    }
                    return novo;
                });
            }
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLesson, savedTime, hasJumpedToTime, supabase]);

  async function pagarRecompensa() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.rpc('reward_watch_time_v2', { user_id: user.id });
  }

  // CONFIGURAÇÃO DO PLYR
  const plyrOptions = {
    autoplay: true,
    controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'
    ],
    youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#C9A66B]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      
      {/* CSS CUSTOMIZADO DO PLYR */}
      <style jsx global>{`
        :root { --plyr-color-main: #C9A66B; }
        .plyr--full-ui input[type=range] { color: #C9A66B; }
        .plyr__control--overlaid { background: rgba(201, 166, 107, 0.9); }
        .plyr--video { border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        .plyr__video-embed iframe { pointer-events: none; }
      `}</style>

      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/evolucao" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">VOLTAR</span>
        </Link>
        <div className="flex items-center gap-4">
            {hasJumpedToTime && savedTime > 0 && (
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
        
        {/* --- PLAYER PLYR PREMIUM --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-black rounded-xl shadow-2xl shadow-black relative z-10">
            {currentLesson && (
                <Plyr
                    ref={playerRef}
                    source={{
                        type: "video",
                        sources: [
                            { src: currentLesson.video_id, provider: "youtube" }
                        ]
                    }}
                    options={plyrOptions}
                />
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
                    setHasJumpedToTime(false);
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

"use client";

import { useState, useEffect } from "react";
import { Play, RefreshCw, Loader2 } from "lucide-react";
import LessonButton from "./LessonButton";

export default function VideoPlayer({ title, videoUrl }: { title: string, videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    if (videoUrl) {
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = videoUrl.match(regExp);
      if (match && match[1]) {
        setVideoId(match[1]);
      } else {
        if(videoUrl.length === 11) setVideoId(videoUrl);
      }
    }
  }, [videoUrl]);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsFinished(true);
    }, 15000); 
  };

  return (
    // BLOQUEIO GERAL DE BOTÃO DIREITO (Context Menu)
    <div onContextMenu={(e) => e.preventDefault()}>
        
        {/* ÁREA DO VÍDEO */}
        <div className="relative w-full aspect-video bg-black border-b lg:border border-white/10 lg:rounded-b-2xl overflow-hidden group shadow-2xl">
            
            {!isPlaying ? (
                /* --- CAPA (Antes do Play) --- */
                <>
                    {videoId && (
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                            style={{ 
                                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)` 
                            }}
                        ></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer" onClick={handlePlay}>
                        <div className="w-24 h-24 bg-[#C9A66B] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_40px_rgba(201,166,107,0.5)] animate-pulse group-hover:animate-none">
                            <Play fill="black" className="ml-2 text-black" size={40} />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 z-20 pointer-events-none">
                         <span className="bg-[#C9A66B] text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-2 inline-block">
                            Aula Exclusiva
                         </span>
                         <h1 className="text-xl md:text-3xl font-black text-white leading-tight max-w-2xl drop-shadow-lg">
                            {title}
                        </h1>
                    </div>
                </>
            ) : (
                /* --- PLAYER BLINDADO --- */
                <div className="relative w-full h-full bg-black">
                    {videoId ? (
                        <>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${videoId}&color=white&iv_load_policy=3&disablekb=1`}
                                title="Aula MASC PRO"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="w-full h-full object-cover"
                            ></iframe>
                            
                            {/* --- ESCUDOS INVISÍVEIS --- */}
                            
                            {/* 1. Bloqueia Barra Superior (Título e Compartilhar) */}
                            <div className="absolute top-0 left-0 w-full h-16 bg-transparent z-10"></div>
                            
                            {/* 2. Bloqueia "Assistir no YouTube" (Canto Inferior Direito - Logo) */}
                            {/* Deixamos um espaço para o botão de Tela Cheia funcionar */}
                            <div className="absolute bottom-14 right-0 w-24 h-12 bg-transparent z-10"></div> 

                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white gap-2">
                             <Loader2 className="animate-spin" /> Carregando...
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* CONTROLES */}
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
                <LessonButton amount={50} locked={!isFinished} />
                
                {isFinished && (
                    <button 
                        onClick={() => setIsPlaying(false)} 
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5"
                    >
                        <RefreshCw size={18} /> Replay
                    </button>
                )}
            </div>

            <div className="prose prose-invert max-w-none border-t border-white/10 pt-6">
                <h3 className="text-xl font-bold text-white mb-2">Sobre esta aula</h3>
                <p className="text-slate-400 leading-relaxed">
                    Conteúdo protegido MASC PRO. A reprodução não autorizada é proibida.
                </p>
            </div>
        </div>
    </div>
  );
}
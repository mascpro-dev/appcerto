"use client";

import { useState, useEffect } from "react";
import { Play, RefreshCw, Loader2 } from "lucide-react";
import LessonButton from "./LessonButton";

export default function VideoPlayer({ title, videoUrl }: { title: string, videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [imgError, setImgError] = useState(false); // Para tratar erro de imagem

  // 1. Extração Inteligente do ID do YouTube
  useEffect(() => {
    if (videoUrl) {
      // Regex poderoso que pega o ID mesmo com &list=, &index=, etc.
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = videoUrl.match(regExp);
      if (match && match[1]) {
        setVideoId(match[1]);
      } else {
        // Fallback: se não achar, tenta pegar o final da string se for curto
        if(videoUrl.length === 11) setVideoId(videoUrl);
      }
    }
  }, [videoUrl]);

  const handlePlay = () => {
    setIsPlaying(true);
    // Libera o botão após 15 segundos
    setTimeout(() => {
      setIsFinished(true);
    }, 15000); 
  };

  return (
    <div>
        {/* ÁREA DO VÍDEO */}
        <div className="relative w-full aspect-video bg-black border-b lg:border border-white/10 lg:rounded-b-2xl overflow-hidden group shadow-2xl">
            
            {!isPlaying ? (
                /* --- CAPA (Antes do Play) --- */
                <>
                    {/* Imagem de Fundo (Usa hqdefault que é garantido) */}
                    {videoId && (
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                            style={{ 
                                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)` 
                            }}
                        ></div>
                    )}
                    
                    {/* Gradiente Dark */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                    {/* Botão Play Personalizado */}
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
                /* --- IFRAME DO YOUTUBE --- */
                <div className="relative w-full h-full bg-black">
                    {videoId ? (
                        <iframe 
                            width="100%" 
                            height="100%" 
                            // Adicionei rel=0, modesto, e autoplay
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=1`}
                            title="Aula MASC PRO"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            className="w-full h-full object-cover"
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white gap-2">
                             <Loader2 className="animate-spin" /> Carregando vídeo...
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* CONTROLES E BOTÃO DE RESGATE */}
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
                
                {/* O botão recebe o estado 'locked' baseado no tempo do vídeo */}
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
                    Assista ao vídeo completo para desbloquear a recompensa em PROs. 
                    O conteúdo prático deste módulo é essencial para sua evolução no ranking.
                </p>
            </div>
        </div>
    </div>
  );
}
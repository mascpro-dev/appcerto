"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import LessonButton from "./LessonButton";

export default function VideoPlayer({ title, lessonId }: { title: string, lessonId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    // Simula o vídeo rodando
    let p = 0;
    const interval = setInterval(() => {
      p += 1; // Avança 1% a cada 50ms (Simulação rápida para teste: 5 segundos total)
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsFinished(true);
        setIsPlaying(false);
      }
    }, 50);
  };

  return (
    <div>
        {/* PLAYER DE VÍDEO SIMULADO */}
        <div className="relative w-full aspect-video bg-slate-900 border-b lg:border border-white/10 lg:rounded-b-2xl overflow-hidden group">
            
            {/* Imagem de Fundo (Simulada) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[url('/grid-pattern.svg')] opacity-20"></div>
            
            {/* Barra de Progresso Real */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">
                <div 
                    className="h-full bg-[#A6CE44] transition-all duration-100 ease-linear" 
                    style={{ width: `${progress}%` }} 
                />
            </div>

            {/* Controles */}
            {!isPlaying && !isFinished && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                    <button 
                        onClick={handlePlay}
                        className="w-20 h-20 bg-[#A6CE44] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(166,206,68,0.4)] animate-pulse"
                    >
                        <Play fill="black" className="ml-1 text-black" size={32} />
                    </button>
                </div>
            )}
            
            {isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center z-10" onClick={() => setIsPlaying(false)}>
                    {/* Aqui entraria o iframe do Youtube/Vimeo */}
                    <p className="text-[#A6CE44] font-mono animate-pulse">REPRODUZINDO AULA... {progress}%</p>
                 </div>
            )}

            {isFinished && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20">
                    <div className="text-center">
                        <p className="text-white font-bold text-xl mb-2">Aula Concluída! 🎉</p>
                        <button onClick={handlePlay} className="text-slate-400 text-sm hover:text-white flex items-center gap-2 justify-center">
                            <Play size={14} /> Assistir Novamente
                        </button>
                    </div>
                 </div>
            )}

            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {title}
                </h1>
            </div>
        </div>

        {/* ÁREA DOS BOTÕES (Conecta com o LessonButton) */}
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
                {/* AQUI ESTÁ A MÁGICA: passamos locked={!isFinished} */}
                <LessonButton amount={50} locked={!isFinished} />
                
                <button className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5">
                    Compartilhar
                </button>
            </div>
            <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-white mb-2">Sobre esta aula</h3>
                <p className="text-slate-400 leading-relaxed">
                    Conteúdo fundamental para o seu avanço no ranking MASC PRO.
                </p>
            </div>
        </div>
    </div>
  );
}
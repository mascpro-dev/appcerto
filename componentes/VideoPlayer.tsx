"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RefreshCw, Volume2, VolumeX, Loader2, Maximize, Minimize } from "lucide-react";
import LessonButton from "./LessonButton";

// Função auxiliar para formatar tempo (ex: 65s -> "01:05")
const formatTime = (seconds: number) => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function VideoPlayer({ title, videoUrl }: { title: string, videoUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null); // Referência para tela cheia
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoId, setVideoId] = useState("");
  
  // Novos estados para o tempo
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 1. Extração do ID
  useEffect(() => {
    if (videoUrl) {
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = videoUrl.match(regExp);
      if (match && match[1]) {
        setVideoId(match[1]);
      } else if (videoUrl.length === 11) {
        setVideoId(videoUrl);
      }
    }
  }, [videoUrl]);

  // 2. Loop para buscar o tempo atual do YouTube (Polling)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        // Pergunta ao YouTube o tempo atual
        sendCommand("getCurrentTime"); 
        // Pergunta a duração total (caso ainda não tenha pego)
        if (duration === 0) sendCommand("getDuration"); 
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // 3. Escuta as respostas do YouTube (PostMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verifica se a mensagem veio do YouTube
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          
          // Se for informação de tempo/infoDelivery
          if (data.event === "infoDelivery" && data.info) {
             if (data.info.currentTime) setCurrentTime(data.info.currentTime);
             if (data.info.duration) setDuration(data.info.duration);
          }
        } catch (e) {
          // Ignora erros de parse
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendCommand = (command: string, args: any = null) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: command,
          args: args || []
        }),
        "*"
      );
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      sendCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendCommand("playVideo");
      setIsPlaying(true);
      
      if (!isFinished) {
        setTimeout(() => {
          setIsFinished(true);
        }, 15000); 
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      sendCommand("unMute");
      setIsMuted(false);
    } else {
      sendCommand("mute");
      setIsMuted(true);
    }
  };

  // Função para ativar/desativar Tela Cheia
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Calcula porcentagem da barra
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="select-none">
        
        {/* CONTAINER DO VÍDEO (Ref para Fullscreen) */}
        <div 
            ref={containerRef} 
            className="relative w-full aspect-video bg-black border-b lg:border border-white/10 lg:rounded-b-2xl overflow-hidden group shadow-2xl"
        >
            
            {/* IFRAME BLOQUEADO */}
            <div className="absolute inset-0 pointer-events-none origin-center"> 
                {videoId ? (
                    <iframe
                        ref={iframeRef}
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&cc_load_policy=0`}
                        title="Aula MASC PRO"
                        allow="autoplay; encrypted-media"
                        className="w-full h-full object-cover"
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-full text-white gap-2">
                        <Loader2 className="animate-spin" /> Carregando...
                    </div>
                )}
            </div>

            {/* PAREDE DE VIDRO (Clique para Play/Pause) */}
            <div 
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-transparent"
                onClick={togglePlay}
            >
                {!isPlaying && (
                    <div className="w-24 h-24 bg-[#C9A66B]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(201,166,107,0.5)] transition-transform hover:scale-110">
                        <Play fill="black" className="ml-2 text-black" size={40} />
                    </div>
                )}
            </div>

            {/* --- BARRA DE CONTROLES INFERIOR --- */}
            <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 transition-opacity duration-300 flex flex-col justify-end px-4 pb-4 pt-8 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                
                {/* BARRA DE PROGRESSO */}
                <div className="w-full h-1 bg-white/20 rounded-full mb-4 relative overflow-hidden">
                    {/* Barra Colorida (Progresso) */}
                    <div 
                        className="h-full bg-[#C9A66B] absolute top-0 left-0 transition-all duration-500 ease-linear"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Play/Pause */}
                        <button onClick={togglePlay} className="text-white hover:text-[#C9A66B] transition-colors">
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>

                        {/* Volume */}
                        <button onClick={toggleMute} className="text-white hover:text-[#C9A66B] transition-colors">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        
                        {/* Tempo (Ex: 01:30 / 10:00) */}
                        <span className="text-xs font-mono font-bold text-white/90">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Logo Marca */}
                        <div className="text-[#C9A66B] font-black italic text-sm tracking-tighter hidden sm:block">
                            MASC <span className="text-white">PRO</span>
                        </div>

                        {/* Botão TELA CHEIA */}
                        <button onClick={toggleFullscreen} className="text-white hover:text-[#C9A66B] transition-colors">
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* CAPA INICIAL */}
            {!isPlaying && !iframeRef.current && videoId && (
                 <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }}
                />
            )}
        </div>

        {/* ÁREA ABAIXO DO VÍDEO (Botão Resgatar) */}
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
                <LessonButton amount={50} locked={!isFinished} />
                
                {isFinished && (
                    <button 
                        onClick={() => {
                            setIsPlaying(true);
                            sendCommand("seekTo", 0);
                            sendCommand("playVideo");
                        }} 
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5"
                    >
                        <RefreshCw size={18} /> Replay
                    </button>
                )}
            </div>

            <div className="prose prose-invert max-w-none border-t border-white/10 pt-6">
                <h3 className="text-xl font-bold text-white mb-2">Sobre esta aula</h3>
                <p className="text-slate-400 leading-relaxed">
                   Conteúdo Exclusivo MASC PRO.
                </p>
            </div>
        </div>
    </div>
  );
}
"use client";

import VideoPlayer from "@/componentes/VideoPlayer";

// Definimos uma função padrão para a página para o Next.js reconhecer a rota
export default function AulasPage() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Aqui carregamos o seu VideoPlayer.tsx original com as aulas anexadas */}
      {/* Passamos as propriedades obrigatórias para evitar o erro de tipagem */}
      <VideoPlayer 
        title="MASC PRO - Sala de Aula" 
        videoUrl="https://www.youtube.com/watch?v=SEU_VIDEO_INICIAL" 
      />
    </div>
  );
}
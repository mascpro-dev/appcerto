"use client";

import VideoPlayer from "@/componentes/VideoPlayer"; 

export default function AulasPage() {
  return (
    <div className="w-full animate-in fade-in duration-500">
       {/* Passando as propriedades que o seu componente agora exige */}
       <VideoPlayer 
          title="Introdução MASC PRO" 
          videoUrl="https://www.youtube.com/watch?v=exemplo" 
       />
    </div>
  );
}
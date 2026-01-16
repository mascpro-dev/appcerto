export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link"; // Importamos o Link para a navegação funcionar
import { Play, Info, ChevronRight, Zap } from "lucide-react";

export default async function EvolucaoPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: modules } = await supabase
    .from("Module")
    .select("*")
    .order("order", { ascending: true });

  const featuredModule = modules?.[0];

  return (
    <div className="pb-24 bg-slate-950 min-h-screen font-sans">
      
      {/* --- 1. HERO SECTION (Destaque) --- */}
      {featuredModule && (
        <div className="relative w-full h-[50vh] md:h-[60vh] flex items-end justify-center">
          {/* Fundo e Efeitos */}
          <div className="absolute inset-0 bg-gradient-to-br from-masc-purple/80 via-slate-900/90 to-black opacity-90" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative z-10 p-6 md:p-12 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            <span className="bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/30 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase mb-3 inline-block backdrop-blur-md">
              Módulo Destaque
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight tracking-tighter drop-shadow-2xl max-w-3xl">
              {featuredModule.title}
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl line-clamp-2 drop-shadow-md font-medium">
              Domine as técnicas fundamentais e comece a acumular seus primeiros pontos PRO.
              O conhecimento transforma sua carreira.
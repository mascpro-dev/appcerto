"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlayCircle, Trophy, Share2, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    // CORREÇÃO: Adicionei "w-full" (largura total) e ajustei o posicionamento
    <div className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-black border-t border-white/10 z-50 px-8 flex items-center justify-between pb-2 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      
      {/* 1. INÍCIO */}
      <Link href="/" className="flex flex-col items-center gap-1 group w-12">
        <LayoutDashboard size={22} className={pathname === "/" ? "text-[#C9A66B]" : "text-slate-500"} />
        <span className={`text-[10px] font-bold ${pathname === "/" ? "text-[#C9A66B]" : "text-slate-500"}`}>Início</span>
      </Link>

      {/* 2. AULAS */}
      <Link href="/evolucao" className="flex flex-col items-center gap-1 group w-12">
        <PlayCircle size={22} className={pathname === "/evolucao" ? "text-[#C9A66B]" : "text-slate-500"} />
        <span className={`text-[10px] font-bold ${pathname === "/evolucao" ? "text-[#C9A66B]" : "text-slate-500"}`}>Aulas</span>
      </Link>

      {/* 3. BOTÃO CENTRAL (PERFIL) - IDÊNTICO AO WHATSAPP */}
      <div className="relative -top-6">
        <Link 
            href="/perfil" 
            className="w-16 h-16 rounded-full bg-[#C9A66B] flex items-center justify-center border-[5px] border-black shadow-[0_0_15px_rgba(201,166,107,0.5)] transition-transform active:scale-95"
        >
            <User size={30} className="text-black" />
        </Link>
      </div>

      {/* 4. RANK */}
      <Link href="/comunidade" className="flex flex-col items-center gap-1 group w-12">
        <Trophy size={22} className={pathname === "/comunidade" ? "text-[#C9A66B]" : "text-slate-500"} />
        <span className={`text-[10px] font-bold ${pathname === "/comunidade" ? "text-[#C9A66B]" : "text-slate-500"}`}>Rank</span>
      </Link>

      {/* 5. REDE */}
      <Link href="/embaixador" className="flex flex-col items-center gap-1 group w-12">
        <Share2 size={22} className={pathname === "/embaixador" ? "text-[#C9A66B]" : "text-slate-500"} />
        <span className={`text-[10px] font-bold ${pathname === "/embaixador" ? "text-[#C9A66B]" : "text-slate-500"}`}>Rede</span>
      </Link>

    </div>
  );
}
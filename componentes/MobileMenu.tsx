"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlayCircle, User, Trophy, Share2 } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    // SÓ APARECE NO MOBILE (md:hidden)
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black border-t border-white/10 z-50 px-6 flex items-center justify-between pb-2">
      
      {/* 1. INÍCIO */}
      <Link href="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#C9A66B]">
        <LayoutDashboard size={24} className={pathname === "/" ? "text-[#C9A66B]" : ""} />
        <span className={`text-[10px] font-bold ${pathname === "/" ? "text-[#C9A66B]" : ""}`}>Início</span>
      </Link>

      {/* 2. AULAS */}
      <Link href="/evolucao" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#C9A66B]">
        <PlayCircle size={24} className={pathname === "/evolucao" ? "text-[#C9A66B]" : ""} />
        <span className={`text-[10px] font-bold ${pathname === "/evolucao" ? "text-[#C9A66B]" : ""}`}>Aulas</span>
      </Link>

      {/* 3. BOTÃO CENTRAL (PERFIL) - FLUTUANDO */}
      <div className="relative -top-6">
        <Link 
            href="/perfil" 
            className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-black shadow-[0_0_20px_rgba(201,166,107,0.4)] transition-transform active:scale-95 ${
                pathname === "/perfil" ? "bg-[#C9A66B] text-black" : "bg-[#C9A66B] text-black"
            }`}
        >
            <User size={28} />
        </Link>
      </div>

      {/* 4. RANK */}
      <Link href="/comunidade" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#C9A66B]">
        <Trophy size={24} className={pathname === "/comunidade" ? "text-[#C9A66B]" : ""} />
        <span className={`text-[10px] font-bold ${pathname === "/comunidade" ? "text-[#C9A66B]" : ""}`}>Rank</span>
      </Link>

      {/* 5. REDE (INDICAR) */}
      <Link href="/embaixador" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#C9A66B]">
        <Share2 size={24} className={pathname === "/embaixador" ? "text-[#C9A66B]" : ""} />
        <span className={`text-[10px] font-bold ${pathname === "/embaixador" ? "text-[#C9A66B]" : ""}`}>Rede</span>
      </Link>

    </div>
  );
}
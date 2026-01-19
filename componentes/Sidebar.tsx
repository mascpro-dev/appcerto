"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  PlayCircle, LayoutGrid, User, Trophy, Share2, 
  Map, ShoppingBag, Calendar, LogOut, ChevronDown 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const extraItems = [
    { name: "Jornada", href: "/jornada", icon: Map },
    { name: "Loja", href: "/loja", icon: ShoppingBag },
    { name: "Eventos", href: "/eventos", icon: Calendar },
  ];

  return (
    <>
      {/* --- HEADER SUPERIOR MOBILE --- */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 md:hidden z-[60]">
        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Masc<span className="text-[#C9A66B]">Pro</span></h2>
        <div className="relative">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-[#C9A66B] px-3 py-1.5 rounded-lg text-[10px] font-black text-black uppercase">
            Menu <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex flex-col">
                {extraItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-4 text-xs font-bold text-slate-400 border-b border-white/5 hover:bg-white/5">
                    <item.icon size={18} className="text-[#C9A66B]" /> {item.name.toUpperCase()}
                  </Link>
                ))}
                <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-4 text-xs font-bold text-red-500 hover:bg-red-500/10 text-left">
                  <LogOut size={18} /> SAIR DA CONTA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- SIDEBAR PC --- */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#050505] border-r border-white/5 hidden md:flex flex-col z-50">
        <div className="p-8">
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Masc<span className="text-[#C9A66B]">Pro</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${pathname === "/" ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"}`}>
            <LayoutGrid size={20} /> Visão Geral
          </Link>
          <Link href="/evolucao" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${pathname === "/evolucao" ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"}`}>
            <PlayCircle size={20} /> Evolução (Aulas)
          </Link>
          <Link href="/rede" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${pathname === "/rede" ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"}`}>
            <Share2 size={20} /> Rede
          </Link>
          <Link href="/comunidade" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${pathname === "/comunidade" ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"}`}>
            <Trophy size={20} /> Rank
          </Link>
          {extraItems.map((item) => (
            <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${pathname === item.href ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"}`}>
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
          <Link href="/perfil" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${pathname === "/perfil" ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"}`}>
            <User size={20} /> Perfil
          </Link>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 font-bold text-xs hover:text-red-500 uppercase tracking-widest">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* --- BARRA INFERIOR MOBILE --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 px-2 py-3 flex justify-around items-end md:hidden z-50 h-20">
        <Link href="/" className={`flex flex-col items-center gap-1 w-16 ${pathname === "/" ? "text-white" : "text-slate-600"}`}>
          <LayoutGrid size={20} /> <span className="text-[9px] font-bold uppercase">Início</span>
        </Link>
        <Link href="/evolucao" className={`flex flex-col items-center gap-1 w-16 ${pathname === "/evolucao" ? "text-white" : "text-slate-600"}`}>
          <PlayCircle size={20} /> <span className="text-[9px] font-bold uppercase">Aulas</span>
        </Link>
        <div className="relative -top-6">
          <Link href="/perfil" className="w-14 h-14 bg-[#C9A66B] rounded-full border-[5px] border-black flex items-center justify-center text-black shadow-lg">
            <User size={24} fill="currentColor" />
          </Link>
        </div>
        <Link href="/comunidade" className={`flex flex-col items-center gap-1 w-16 ${pathname === "/comunidade" ? "text-white" : "text-slate-600"}`}>
          <Trophy size={20} /> <span className="text-[9px] font-bold uppercase">Rank</span>
        </Link>
        <Link href="/rede" className={`flex flex-col items-center gap-1 w-16 ${pathname === "/rede" ? "text-white" : "text-slate-600"}`}>
          <Share2 size={20} /> <span className="text-[9px] font-bold uppercase">Rede</span>
        </Link>
      </div>
    </>
  );
}
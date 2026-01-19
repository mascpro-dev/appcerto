"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle, LayoutGrid, User, Trophy, Share2, Map } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Início", href: "/", icon: LayoutGrid },
    { name: "Evolução", href: "/evolucao", icon: PlayCircle }, // Restaurado
    { name: "Jornada", href: "/jornada", icon: Map },
    { name: "Rank", href: "/comunidade", icon: Trophy },
    { name: "Rede", href: "/rede", icon: Share2 },
  ];

  return (
    <>
      {/* --- MENU DESKTOP (PC) --- */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#050505] border-r border-white/5 hidden md:flex flex-col z-50">
        <div className="p-8">
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Masc<span className="text-[#C9A66B]">Pro</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? "bg-[#C9A66B] text-black shadow-lg" : "text-slate-500 hover:text-white"}`}>
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* --- MENU MOBILE (CELULAR - BARRA INFERIOR) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-6 py-4 flex justify-between items-center md:hidden z-50">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-[#C9A66B]" : "text-slate-500"}`}>
              <item.icon size={20} />
              <span className="text-[10px] font-bold uppercase">{item.name}</span>
            </Link>
          );
        })}
        {/* BOTÃO CENTRAL DO PERFIL (CONFORME SEU PRINT) */}
        <Link href="/perfil" className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#C9A66B] rounded-full border-4 border-black flex items-center justify-center text-black shadow-xl">
            <User size={24} />
        </Link>
      </div>
    </>
  );
}
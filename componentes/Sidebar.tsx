"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PlayCircle, Trophy, Share2, LogOut, User, ShoppingBag, Calendar } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  // MENU DO PC (Com Rede e Loja)
  const menuItems = [
    { label: "Visão Geral", href: "/", icon: LayoutDashboard },
    { label: "Evolução", href: "/evolucao", icon: PlayCircle },
    { label: "Comunidade", href: "/comunidade", icon: Trophy },
    { label: "Loja PRO", href: "/loja", icon: ShoppingBag },
    { label: "Eventos", href: "/eventos", icon: Calendar },
    { label: "Rede", href: "/embaixador", icon: Share2 }, // <-- VOLTOU AQUI
    { label: "Meu Perfil", href: "/perfil", icon: User },
  ];

  return (
    <>
      {/* ======================= VERSÃO PC ======================= */}
      <aside className="hidden md:flex w-64 bg-black border-r border-white/10 flex-col h-full shrink-0 z-50">
        <div className="p-8">
          <h1 className="text-2xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
            Hub Educacional
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all border ${
                  isActive
                    ? "bg-[#1a1a1a] border-white/10 text-white font-bold"
                    : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-500"} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 w-full text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="text-sm font-bold">Sair</span>
          </button>
        </div>
      </aside>

      {/* ======================= VERSÃO CELULAR ======================= */}
      
      {/* 1. TOPO FIXO NO CELULAR (Para o botão Sair) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-black/90 backdrop-blur-md border-b border-white/10 z-[50] flex items-center justify-between px-6">
         <h1 className="text-lg font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
         </h1>
         <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-2">
            <LogOut size={20} />
         </button>
      </div>

      {/* 2. MENU RODAPÉ NO CELULAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-white/10 z-[9999] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-6 h-20 max-w-sm mx-auto relative">
          
          <Link href="/" className="flex flex-col items-center justify-center w-12 gap-1">
            <LayoutDashboard size={20} className={pathname === "/" ? "text-[#C9A66B]" : "text-slate-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/" ? "text-[#C9A66B]" : "text-slate-500"}`}>Início</span>
          </Link>

          <Link href="/evolucao" className="flex flex-col items-center justify-center w-12 gap-1">
            <PlayCircle size={22} className={pathname === "/evolucao" ? "text-[#C9A66B]" : "text-slate-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/evolucao" ? "text-[#C9A66B]" : "text-slate-500"}`}>Aulas</span>
          </Link>

          <div className="relative -top-6">
            <Link href="/perfil" className="w-14 h-14 rounded-full bg-[#C9A66B] flex items-center justify-center border-[4px] border-black shadow-[0_0_15px_rgba(201,166,107,0.5)]">
                <User size={24} className="text-black" />
            </Link>
          </div>

          <Link href="/comunidade" className="flex flex-col items-center justify-center w-12 gap-1">
            <Trophy size={20} className={pathname === "/comunidade" ? "text-[#C9A66B]" : "text-slate-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/comunidade" ? "text-[#C9A66B]" : "text-slate-500"}`}>Rank</span>
          </Link>

          <Link href="/embaixador" className="flex flex-col items-center justify-center w-12 gap-1">
            <Share2 size={20} className={pathname === "/embaixador" ? "text-[#C9A66B]" : "text-slate-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/embaixador" ? "text-[#C9A66B]" : "text-slate-500"}`}>Rede</span>
          </Link>

        </div>
      </div>
    </>
  );
}
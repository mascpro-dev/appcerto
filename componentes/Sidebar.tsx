"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Award, LogOut } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Minha Rede", href: "/rede", icon: Users },
    { name: "Jornada", href: "/jornada", icon: Award },
  ];

  return (
    <>
      {/* ==============================================================
          VISÃO DESKTOP (COMPUTADOR)
          Só aparece em telas médias ou grandes (md:flex)
      ============================================================== */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0A0A0A] border-r border-white/10 fixed left-0 top-0 z-50">
        <div className="p-8">
          <h1 className="text-2xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-[#C9A66B] text-black font-bold shadow-[0_0_15px_rgba(201,166,107,0.3)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={20} className={isActive ? "text-black" : "text-slate-500 group-hover:text-white"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors w-full text-left"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* ==============================================================
          VISÃO MOBILE (CELULAR)
          Só aparece em telas pequenas (md:hidden)
      ============================================================== */}
      
      {/* 1. BARRA DO TOPO (LOGO) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md
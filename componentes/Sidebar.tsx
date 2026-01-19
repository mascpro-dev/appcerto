"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Award, LogOut, Menu } from "lucide-react";
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
    { name: "Minha Jornada", href: "/jornada", icon: Award },
  ];

  return (
    <>
      {/* =======================================================
          🖥️ DESKTOP SIDEBAR (O visual original aprovado)
          Fixo na esquerda, altura total, fundo preto.
      ======================================================= */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-black border-r border-white/10 fixed left-0 top-0 z-50">
        
        {/* LOGO */}
        <div className="p-8">
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
          </h1>
        </div>

        {/* MENU ITENS */}
        <nav className="flex-1 px-4 space-y-3 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-[#C9A66B] text-black font-bold shadow-[0_0_20px_rgba(201,166,107,0.4)]" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={22} className={isActive ? "text-black" : "text-slate-500 group-hover:text-white"} />
                <span className="text-sm uppercase tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTÃO SAIR (Rodapé do Desktop) */}
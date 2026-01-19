"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutGrid,     // Visão Geral
  PlayCircle,     // Aulas
  Share2,         // Rede
  UserCircle,     // Perfil
  Trophy,         // Comunidade (Ranking)
  Menu,           // Ícone do Menu Superior
  X,              // Ícone Fechar
  ShoppingBag,    // Loja (Menu Extra)
  Calendar,       // Eventos (Menu Extra)
  LogOut,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // --- CONFIGURAÇÃO DESKTOP (Completa) ---
  const desktopItems = [
    { name: "Visão Geral", href: "/", icon: LayoutGrid },
    { name: "Evolução", href: "/jornada", icon: TrendingUp },
    { name: "Minha Rede", href: "/rede", icon: Share2 },
    { name: "Ranking", href: "/ranking", icon: Trophy },
    { name: "Loja PRO", href: "/loja", icon: ShoppingBag },
    { name: "Eventos", href: "/agenda", icon: Calendar },
    { name: "Meu Perfil", href: "/perfil", icon: UserCircle },
  ];

  // --- CONFIGURAÇÃO MOBILE INFERIOR (Os 5 Obrigatórios) ---
  const mobileBottomItems = [
    { name: "Início", href: "/", icon: LayoutGrid },
    { name: "Aulas", href: "/jornada", icon: PlayCircle }, // Link para Jornada/Aulas
    { name: "Rede", href: "/rede", icon: Share2 },
    { name: "Perfil", href: "/perfil", icon: UserCircle },
    { name: "Rank", href: "/ranking", icon: Trophy }, // Comunidade virou Ranking
  ];

  // --- ITENS DO MENU SUPERIOR (O que sobrou) ---
  const mobileExtraItems = [
    { name: "Loja Oficial", href: "/loja", icon: ShoppingBag },
    { name: "Agenda de Eventos", href: "/agenda", icon: Calendar },
  ];

  return (
    <>
      {/* ==============================================================
          🖥️ DESKTOP SIDEBAR (Fixo na esquerda)
      ============================================================== */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-black border-r border-white/10 fixed left-0 top-0 z-50">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
          </h1>
          <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Hub Educacional</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {desktopItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-[#1A1A1A] text-white border-l-2 border-[#C9A66B]" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon size={20} className={isActive ? "text-[#C9A66B]" : "text-slate-500 group-hover:text-white"} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-slate-600 hover:text-red-500 transition-colors">
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Sair</span>
          </button>
        </div>
      </aside>

      {/* ==============================================================
          📱 MOBILE TOP BAR (Logo + Menu Hambúrguer)
      ============================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
        <h1 className="text-lg font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
        </h1>
        
        {/* BOTÃO QUE ABRE O MENU SUPERIOR */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ==============================================================
          📱 MENU GAVETA (Abre quando clica no Hambúrguer)
      ============================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 flex flex-col p-8">
           <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X size={32} />
              </button>
           </div>
           
           <div className="flex flex-col gap-6 mt-10">
              <p className="text-xs font-bold text-[#C9A66B] uppercase tracking-widest mb-2">Menu Extra</p>
              {mobileExtraItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-2xl font-bold text-white hover:text-[#C9A66B]"
                >
                  <item.icon size={28} />
                  {item.name}
                </Link>
              ))}

              <hr className="border-white/10 my-4" />

              <button onClick={handleLogout} className="flex items-center gap-4 text-xl font-bold text-red-500">
                <LogOut size={24} />
                Sair do App
              </button>
           </div>
        </div>
      )}

      {/* ==============================================================
          📱 MOBILE BOTTOM BAR (Os 5 Fixos)
      ============================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-black border-t border-white/10 z-40 flex justify-between items-center px-6 pb-2">
        {mobileBottomItems.map((item) => {
             const isActive = pathname === item.href
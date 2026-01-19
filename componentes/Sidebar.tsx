"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid,     // Início
  PlayCircle,     // Aulas
  User,           // Perfil
  Trophy,         // Rank
  Share2,         // Rede (Icone de compartilhamento/rede)
  TrendingUp,     // Evolução (Desktop)
  MessageCircle,  // Comunidade (Desktop)
  ShoppingBag,    // Loja (Desktop)
  Calendar,       // Eventos (Desktop)
  LogOut 
} from "lucide-react";
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

  // --- CONFIGURAÇÃO DO MENU DESKTOP (Completo) ---
  const desktopItems = [
    { name: "Visão Geral", href: "/", icon: LayoutGrid },
    { name: "Evolução (Aulas)", href: "/jornada", icon: TrendingUp }, // Aulas aqui dentro
    { name: "Minha Rede", href: "/rede", icon: Share2 },
    { name: "Comunidade", href: "/comunidade", icon: MessageCircle },
    { name: "Loja PRO", href: "/loja", icon: ShoppingBag },
    { name: "Eventos", href: "/agenda", icon: Calendar },
    { name: "Meu Perfil", href: "/perfil", icon: User },
  ];

  // --- CONFIGURAÇÃO DO MENU MOBILE (Exatamente igual sua foto) ---
  const mobileItems = [
    { name: "Início", href: "/", icon: LayoutGrid },
    { name: "Aulas", href: "/jornada", icon: PlayCircle }, // Linkamos Aulas para a Jornada
    { name: "Perfil", href: "/perfil", icon: User, isFloating: true }, // O Dourado
    { name: "Rank", href: "/ranking", icon: Trophy },
    { name: "Rede", href: "/rede", icon: Share2 },
  ];

  return (
    <>
      {/* ==============================================================
          🖥️ DESKTOP SIDEBAR (Fixo na esquerda - Preto)
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
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-600 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Sair</span>
          </button>
        </div>
      </aside>


      {/* ==============================================================
          📱 MOBILE BOTTOM BAR (O Visual do Print)
      ============================================================== */}
      
      {/* Barra preta fixa no fundo */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-black border-t border-white/10 z-50 flex justify-between items-center px-6 pb-2">
        
        {mobileItems.map((item) => {
             const isActive = pathname === item.href;
             const Icon = item.icon;

             // SE FOR O BOTÃO DO MEIO (PERFIL) - FLUTUANTE DOURADO
             if (item.isFloating) {
               return (
                 <div key={item.name} className="relative -top-8">
                   <Link 
                     href={item.href}
                     className={`
                        w-16 h-16 rounded-full flex items-center justify-center 
                        bg-[#C9A66B] border-[6px] border-black shadow-[0_0_20px_rgba(201,166,107,0.4)]
                        transition-transform active:scale-95
                     `}
                   >
                     <Icon size={28} className="text-black" strokeWidth={2.5} />
                   </Link>
                 </div>
               );
             }

             // ÍCONES NORMAIS (Início, Aulas, Rank, Rede)
             return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex flex-col items-center gap-1 transition-colors
                    ${isActive ? "text-[#C9A66B]" : "text-slate-500"}
                  `}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold">{item.name}</span>
                </Link>
             );
        })}
      </div>
    </>
  );
}
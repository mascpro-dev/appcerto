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
    { name: "Minha Jornada", href: "/jornada", icon: Award },
  ];

  return (
    <>
      {/* =======================================================
          🖥️ DESKTOP SIDEBAR (Fixo na esquerda)
      ======================================================= */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-black border-r border-white/10 fixed left-0 top-0 z-50">
        
        <div className="p-8">
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
          </h1>
        </div>

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

        <div className="p-6 border-t border-white/10 bg-black">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm uppercase">Sair</span>
          </button>
        </div>
      </aside>


      {/* =======================================================
          📱 MOBILE NAVIGATION (Topo + Base)
      ======================================================= */}
      
      {/* BARRA SUPERIOR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6">
        <h1 className="text-xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
        </h1>
        <div className="text-[10px] font-bold text-[#C9A66B] border border-[#C9A66B]/30 px-2 py-1 rounded">
            BETA
        </div>
      </div>

      {/* BARRA INFERIOR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-black border-t border-white/10 z-50 pb-4 px-2 flex justify-around items-center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300
                ${isActive ? "text-[#C9A66B]" : "text-slate-600 hover:text-slate-400"}
              `}
            >
              <div className={`mb-1 p-1 rounded-full ${isActive ? 'bg-[#C9A66B]/10' : ''}`}>
                 <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.name.split(" ")[0]} 
              </span>
            </Link>
          );
        })}

        <button 
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-16 h-16 text-slate-700 active:text-red-500"
        >
            <LogOut size={22} strokeWidth={2} />
            <span className="text-[9px] font-bold uppercase mt-1 opacity-60">Sair</span>
        </button>
      </div>
    </>
  );
}
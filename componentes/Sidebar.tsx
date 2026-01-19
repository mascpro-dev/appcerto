"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  GraduationCap, 
  Users, 
  ShoppingBag, 
  MessageSquare,
  Menu,
  X,
  Trophy,
  User
} from "lucide-react";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Início", href: "/" },
  { icon: Target, label: "Jornada", href: "/jornada" },
  { icon: GraduationCap, label: "Evolução", href: "/evolucao" },
  { icon: Users, label: "Minha Rede", href: "/rede" },
  { icon: MessageSquare, label: "Comunidade", href: "/comunidade" },
  { icon: ShoppingBag, label: "Loja PRO", href: "/loja" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MENU SUPERIOR MOBILE */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C9A66B] rounded-lg flex items-center justify-center font-black text-black italic">M</div>
          <span className="text-white font-black italic uppercase tracking-tighter">Masc <span className="text-[#C9A66B]">Pro</span></span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#050505] border-r border-white/5 hidden lg:flex flex-col z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#C9A66B] rounded-xl flex items-center justify-center font-black text-black italic text-xl shadow-[0_0_20px_rgba(201,166,107,0.3)]">M</div>
            <div>
              <p className="text-white font-black italic uppercase tracking-tighter leading-none text-lg">Masc <span className="text-[#C9A66B]">Pro</span></p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Membro Fundador</p>
            </div>
          </div>

          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
                    ? "bg-[#C9A66B] text-black font-black shadow-[0_10px_20px_rgba(201,166,107,0.2)]" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-black" : "group-hover:text-[#C9A66B]"} />
                  <span className="text-xs uppercase tracking-widest font-bold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PERFIL FIXO NO RODAPÉ DA SIDEBAR */}
        <div className="mt-auto p-6 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[#C9A66B]">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase truncate">Masc Pro User</p>
              <p className="text-[9px] font-bold text-[#C9A66B] uppercase tracking-widest">1.100 PRO</p>
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY E MENU MOBILE ABERTO */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl p-8 pt-24">
            <nav className="space-y-4">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-6 p-4 text-white text-xl font-black italic uppercase tracking-tighter border-b border-white/5"
                >
                  <item.icon size={24} className="text-[#C9A66B]" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
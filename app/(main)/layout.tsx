"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, GraduationCap, Users, ShoppingBag, 
  Calendar, User, LogOut, Menu, X, Crown
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const navItems = [
    { href: "/home", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/evolucao", label: "Evolução", icon: GraduationCap },
    { href: "/comunidade", label: "Comunidade", icon: Users },
    { href: "/produtos", label: "Loja PRO", icon: ShoppingBag },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/perfil", label: "Meu Perfil", icon: User },
  ];

  // Verifica se estamos na página "tipo Netflix" para remover as margens
  const isImmersivePage = pathname === '/evolucao';

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-masc-gold selection:text-black">
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-black p-6 fixed h-full z-10">
        <div className="mb-10 pl-2">
          <h1 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-1">
            MASC<span className="text-masc-blue">PRO</span> <Crown size={16} className="text-masc-gold mb-1" />
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
            Hub Educacional
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-white/5 text-white border border-white/10 shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-masc-gold"></div>}
                <item.icon
                  size={20}
                  className={isActive ? "text-masc-gold" : "text-slate-500 group-hover:text-white transition-colors"}
                />
                <span className={`font-medium text-sm ${isActive ? "font-bold tracking-wide" : ""}`}>
                    {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:text-masc-wine hover:bg-masc-wine/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* --- MENU MOBILE (Topo Fixo) --- */}
      {/* Adicionamos bg-black/50 e backdrop-blur para ele ser semi-transparente sobre o banner */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center transition-all">
        <span className="font-black italic text-lg text-white">MASC<span className="text-masc-blue">PRO</span></span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black p-6 space-y-4 animate-in slide-in-from-right">
             {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl border ${
                    pathname.startsWith(item.href) ? "bg-white/10 border-masc-gold text-white" : "bg-white/5 border-white/5 text-slate-400"
                }`}
              >
                <item.icon size={24} className={pathname.startsWith(item.href) ? "text-masc-gold" : ""} />
                <span className="font-bold text-lg">{item.label}</span>
              </Link>
            ))}
        </div>
      )}

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 md:ml-72 min-h-screen bg-black">
        {/* AQUI ESTÁ A MÁGICA: Se for Evolução, removemos o padding (p-0). Se não, mantemos o padrão. */}
        <div className={isImmersivePage ? "p-0 w-full" : "p-6 pt-24 md:p-10 md:pt-10 max-w-7xl mx-auto"}>
            {children}
        </div>
      </main>
    </div>
  );
}
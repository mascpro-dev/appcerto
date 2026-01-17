import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  User, 
  LogOut,
  Menu
} from "lucide-react";
import LogoutButton from "../../componentes/LogoutButton";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* --- 1. SIDEBAR (Só aparece no Computador/Desktop) --- */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col fixed h-full bg-black z-50">
        <div className="p-6">
            <h1 className="text-2xl font-black text-white italic tracking-tighter">
            MASC <span className="text-[#C9A66B]">PRO</span>
            </h1>
            <p className="text-slate-500 text-xs tracking-widest uppercase mt-1">Hub Educacional</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/home" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                <LayoutDashboard size={20} /> Visão Geral
            </Link>
            <Link href="/evolucao" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                <GraduationCap size={20} /> Evolução
            </Link>
            <Link href="/comunidade" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                <Users size={20} /> Comunidade
            </Link>
            <Link href="/embaixador" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                <Menu size={20} /> Área Embaixador
            </Link>
            <Link href="/perfil" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                <User size={20} /> Meu Perfil
            </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
            <LogoutButton />
        </div>
      </aside>

      {/* --- 2. BARRA DE NAVEGAÇÃO MOBILE (Só aparece no Celular) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-white/10 z-50 pb-safe">
        <div className="flex justify-around items-center p-4">
             <Link href="/home" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#C9A66B] transition-colors">
                <LayoutDashboard size={20} />
                <span className="text-[10px] font-bold">Início</span>
             </Link>
             <Link href="/evolucao" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#C9A66B] transition-colors">
                <GraduationCap size={20} />
                <span className="text-[10px] font-bold">Aulas</span>
             </Link>
             <div className="relative -top-5">
                 <Link href="/perfil" className="flex flex-col items-center justify-center w-14 h-14 bg-[#C9A66B] rounded-full text-black shadow-[0_0_20px_rgba(201,166,107,0.4)] border-4 border-black">
                    <User size={24} />
                 </Link>
             </div>
             <Link href="/comunidade" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#C9A66B] transition-colors">
                <Users size={20} />
                <span className="text-[10px] font-bold">Rank</span>
             </Link>
             <Link href="/embaixador" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#C9A66B] transition-colors">
                <Menu size={20} />
                <span className="text-[10px] font-bold">Rede</span>
             </Link>
        </div>
      </div>

      {/* --- 3. CONTEÚDO PRINCIPAL (Ajustado para não ficar escondido) --- */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-28 md:pb-8">
        
        {/* Topo Mobile (Para saber onde estamos) */}
        <div className="md:hidden mb-6 flex justify-between items-center">
            <div className="text-xl font-black text-white italic tracking-tighter">
                MASC <span className="text-[#C9A66B]">PRO</span>
            </div>
            {/* Um botãozinho de sair discreto no mobile */}
            <div className="w-8">
               {/* Espaço reservado ou botão de config */}
            </div>
        </div>

        {children}
      </main>
    </div>
  );
}
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  ShoppingBag, 
  User, 
} from "lucide-react";
// Importamos o botão que acabamos de criar
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
    <div className="flex min-h-screen bg-black">
      {/* SIDEBAR */}
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
            <Link href="/perfil" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                <User size={20} /> Meu Perfil
            </Link>
            <div className="mt-8 pt-8 border-t border-white/5">
                 <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Em Breve</p>
                 <span className="flex items-center gap-3 text-slate-600 px-4 py-2 text-sm font-bold opacity-50 cursor-not-allowed">
                    <ShoppingBag size={20} /> Loja PRO
                 </span>
            </div>
        </nav>

        <div className="p-4 border-t border-white/10">
            {/* Aqui está o botão corrigido */}
            <LogoutButton />
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
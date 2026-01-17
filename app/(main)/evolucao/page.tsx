export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { Play, Lock, Zap, Trophy } from "lucide-react";

export default async function EvolucaoPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // 1. Pega a Sessão do Usuário
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Busca o Saldo do Usuário (Para mostrar no topo e controlar acesso)
  const { data: profile } = await supabase
    .from("profiles")
    .select("pro_balance")
    .eq("id", session?.user?.id)
    .single();

  const balance = profile?.pro_balance ?? 0;

  // 3. Busca as Aulas (Módulos)
  const { data: modules } = await supabase
    .from("Module")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* CABEÇALHO COM SALDO (A novidade!) */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            EVOLUÇÃO <span className="text-[#C9A66B]">PRO</span>
          </h1>
          <p className="text-slate-400 mt-2">Invista seus PROs para desbloquear conhecimento.</p>
        </div>

        {/* Mostrador de Saldo na Página de Evolução */}
        <div className="bg-[#C9A66B]/10 border border-[#C9A66B]/30 px-6 py-3 rounded-xl flex items-center gap-3">
            <Trophy size={20} className="text-[#C9A66B]" />
            <div>
                <p className="text-[10px] text-[#C9A66B] font-bold uppercase tracking-widest leading-none">Seu Saldo</p>
                <p className="text-2xl font-black text-white leading-none mt-1">{balance} PRO</p>
            </div>
        </div>
      </div>

      {/* GRID DE AULAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {modules?.map((lesson) => (
          <Link 
            key={lesson.id} 
            href={`/aula/${lesson.id}`}
            className="group relative bg-slate-900 border border-white/5 hover:border-[#C9A66B]/50 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col"
          >
            {/* Capa do Card */}
            <div className="aspect-video relative bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80 z-10" />
                {/* Se quiser, pode colocar uma imagem real aqui: <img src={lesson.cover_url} ... /> */}
                <div className="absolute inset-0 flex items-center justify-center z-0 opacity-30">
                     <Play size={40} className="text-white" />
                </div>
                
                {/* Badge do Módulo */}
                <div className="absolute top-4 left-4 z-20 bg-[#C9A66B] text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                    MÓDULO {String(lesson.id).padStart(2, '0')}
                </div>
            </div>

            <div className="relative z-20 p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A66B] transition-colors line-clamp-2 leading-tight mb-2">
                    {lesson.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-[#C9A66B]" />
                        <span className="text-xs text-white font-bold">Ganhe 50 PRO</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A66B] transition-colors">
                        <Play size={14} className="ml-0.5 text-white group-hover:text-black" fill="currentColor" />
                    </div>
                </div>
            </div>
          </Link>
        ))}

        {/* Card Bloqueado (Exemplo Visual) */}
        <div className="relative bg-slate-950 border border-white/5 rounded-2xl overflow-hidden opacity-50 cursor-not-allowed aspect-video md:aspect-auto flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-white/10">
                    <Lock size={20} className="text-slate-600" />
                </div>
                <div className="text-center">
                    <p className="text-slate-500 font-bold">Nível Avançado</p>
                    <p className="text-slate-600 text-xs mt-1">Requer 5.000 PRO</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
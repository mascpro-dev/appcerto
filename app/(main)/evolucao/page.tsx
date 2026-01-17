import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { Play, Lock, CheckCircle, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EvolucaoPage() {
  const supabase = createServerComponentClient({ cookies });

  // Pega as aulas
  const { data: modules } = await supabase
    .from("Module")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter">
          EVOLUÇÃO <span className="text-[#C9A66B]">PRO</span>
        </h1>
        <p className="text-slate-400 mt-2">Sua trilha para o topo do ranking.</p>
      </div>

      {/* --- MUDANÇA AQUI: Grid de Cards (3 por linha) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {modules?.map((lesson) => (
          <Link 
            key={lesson.id} 
            href={`/aula/${lesson.id}`}
            className="group relative bg-slate-900 border border-white/5 hover:border-[#C9A66B]/50 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl aspect-[4/3] flex flex-col"
          >
            {/* Capa do Card (Simulada) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/50 to-transparent opacity-60 z-10" />
            
            {/* Padrão de fundo decorativo */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="relative z-20 p-6 flex flex-col h-full justify-end">
                <div className="mb-auto flex justify-between items-start">
                    <div className="bg-[#C9A66B] text-black text-[10px] font-bold px-2 py-1 rounded">
                        MÓDULO {String(lesson.id).padStart(2, '0')}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-[#C9A66B] transition-colors">
                        <Play size={14} className="ml-0.5 text-white group-hover:text-black" fill="currentColor" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#C9A66B] transition-colors line-clamp-2 leading-tight">
                    {lesson.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                    <Zap size={12} className="text-[#C9A66B]" />
                    <p className="text-xs text-slate-400 font-mono">Ganhe <span className="text-white font-bold">50 PRO</span></p>
                </div>
            </div>
          </Link>
        ))}

        {/* Card de Exemplo Bloqueado (Para dar volume) */}
        {[1, 2].map((i) => (
             <div key={i} className="relative bg-slate-950 border border-white/5 rounded-2xl overflow-hidden opacity-50 aspect-[4/3] flex items-center justify-center grayscale">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-white/10">
                        <Lock size={20} className="text-slate-600" />
                    </div>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Em Breve</p>
                </div>
             </div>
        ))}

      </div>
    </div>
  );
}
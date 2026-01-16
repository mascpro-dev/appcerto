import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Play, Lock, CheckCircle, Zap } from "lucide-react";

export default async function EvolucaoPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: modules } = await supabase
    .from("Module") 
    .select("*")
    .order("order", { ascending: true });

  return (
    <div className="space-y-8 pb-20">
      {/* Cabeçalho com toque de Ouro para motivar */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-4xl font-black text-white italic tracking-tighter">
          EVOLUÇÃO <span className="text-masc-gold">PRO</span>
        </h1>
        <p className="text-masc-bone/60 mt-2 text-lg">
          Cada aula assistida gera moedas. O conhecimento é sua moeda de troca.
        </p>
      </div>

      <div className="grid gap-5">
        {modules && modules.length > 0 ? (
          modules.map((modulo: any, index: number) => (
            <div 
              key={modulo.id} 
              className="group relative bg-slate-900/50 backdrop-blur-sm border border-masc-purple/30 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:bg-slate-900 hover:border-masc-lime/50 hover:shadow-[0_0_30px_rgba(166,206,68,0.1)] cursor-pointer"
            >
              {/* Efeito de Gradiente sutil no fundo */}
              <div className="absolute inset-0 bg-gradient-to-r from-masc-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {/* Ícone de Play que "acende" ao passar o mouse */}
                  <div className="h-16 w-16 bg-slate-950 border border-white/10 rounded-full flex items-center justify-center group-hover:border-masc-lime group-hover:text-masc-lime text-slate-500 transition-all shadow-xl">
                    <Play size={28} fill="currentColor" className="ml-1" />
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold text-masc-gold tracking-widest uppercase mb-1 block">
                      Módulo {index + 1}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-masc-bone transition-colors">
                      {modulo.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                      <Zap size={14} className="text-masc-lime" />
                      <span>Gera PROs ao finalizar</span>
                    </div>
                  </div>
                </div>

                {/* Botão Fake de Ação (Neuromarketing: CTA visual) */}
                <div className="hidden md:flex items-center px-6 py-2 rounded-full border border-white/10 text-xs font-bold text-slate-300 group-hover:bg-masc-lime group-hover:text-black group-hover:border-transparent transition-all uppercase tracking-wide">
                  Iniciar Aula
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Carregando jornada...</p>
          </div>
        )}
      </div>
    </div>
  );
}
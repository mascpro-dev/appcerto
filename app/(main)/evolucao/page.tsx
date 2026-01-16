export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link"; // Importamos o Link para a navegação funcionar
import { Play, Info, ChevronRight, Zap } from "lucide-react";

export default async function EvolucaoPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: modules } = await supabase
    .from("Module")
    .select("*")
    .order("order", { ascending: true });

  const featuredModule = modules?.[0];

  return (
    <div className="pb-24 bg-slate-950 min-h-screen font-sans">
      
      {/* --- 1. HERO SECTION (Destaque) --- */}
      {featuredModule && (
        <div className="relative w-full h-[50vh] md:h-[60vh] flex items-end justify-center">
          {/* Fundo e Efeitos */}
          <div className="absolute inset-0 bg-gradient-to-br from-masc-purple/80 via-slate-900/90 to-black opacity-90" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative z-10 p-6 md:p-12 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            <span className="bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/30 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase mb-3 inline-block backdrop-blur-md">
              Módulo Destaque
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight tracking-tighter drop-shadow-2xl max-w-3xl">
              {featuredModule.title}
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl line-clamp-2 drop-shadow-md font-medium">
              Domine as técnicas fundamentais e comece a acumular seus primeiros pontos PRO.
              O conhecimento transforma sua carreira.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {/* --- BOTÃO ASSISTIR AGORA (Com Link para a Aula) --- */}
              <Link href={`/aula/${featuredModule.id}`}>
                <button className="bg-[#A6CE44] hover:bg-[#95b93d] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(166,206,68,0.3)] text-sm uppercase tracking-wide">
                    <Play fill="currentColor" size={18} />
                    Assistir Agora
                </button>
              </Link>

              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:border-white/40 text-sm uppercase tracking-wide">
                <Info size={18} />
                Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Wrapper para as Trilhas de Conteúdo --- */}
      <div className="space-y-12 relative z-20 px-6 md:px-12 -mt-4 max-w-7xl mx-auto">
        
        {/* --- 2. TRILHA: Continuar Assistindo (Exemplo Estático) --- */}
        <section>
          <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            Continuar Aprendendo <ChevronRight className="text-[#C9A66B]" size={20} />
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
             <div className="min-w-[260px] md:min-w-[300px] bg-slate-900/50 rounded-xl overflow-hidden border border-white/10 snap-start cursor-pointer hover:border-masc-blue/50 transition-all group hover:shadow-md hover:shadow-masc-blue/10 hover:-translate-y-1">
                <div className="h-36 md:h-40 bg-slate-800/50 relative group-hover:bg-slate-800/80 transition-colors flex items-center justify-center">
                    <Play size={40} className="text-white/70 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-lg" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
                        <div className="h-full bg-gradient-to-r from-[#C9A66B] to-amber-300 w-[45%] shadow-[0_0_10px_rgba(201,166,107,0.5)]" />
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-slate-100 font-bold text-base truncate leading-tight">Aula 2: Colorimetria Avançada</h3>
                    <p className="text-[10px] text-[#C9A66B] font-medium mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A66B] animate-pulse"/>
                      Restam 15 min
                    </p>
                </div>
             </div>
          </div>
        </section>

        {/* --- 3. GRID: Jornada Completa --- */}
        <section>
          <h2 className="text-white font-bold text-xl mb-4">Jornada Completa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules?.map((modulo: any, index: number) => (
              // --- CARD CLICÁVEL (Com Link para a Aula) ---
              <Link key={modulo.id} href={`/aula/${modulo.id}`} className="block">
                <div 
                    className="group bg-slate-900/30 hover:bg-slate-900/80 border border-white/5 hover:border-[#A6CE44]/30 rounded-xl overflow-hidden transition-all hover:-translate-y-1 duration-300 hover:shadow-xl hover:shadow-[#A6CE44]/5 h-full"
                >
                    <div className={`h-36 w-full relative p-4 flex flex-col justify-end items-start
                        ${index % 2 === 0 ? 'bg-gradient-to-t from-masc-teal/90 via-masc-teal/50 to-slate-900/20' : 'bg-gradient-to-t from-masc-purple/90 via-masc-purple/50 to-slate-900/20'}
                    `}>
                        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider shadow-sm">
                            Módulo {index + 1}
                        </span>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300">
                        <Play size={24} className="text-white ml-0.5" fill="currentColor" />
                        </div>
                    </div>
                    
                    <div className="p-4">
                    <h3 className="text-white font-bold text-base leading-snug group-hover:text-[#A6CE44] transition-colors line-clamp-2">
                        {modulo.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A6CE44] animate-pulse shadow-[0_0_8px_rgba(166,206,68,0.6)]" />
                            <span className="uppercase tracking-wider">Fundamental</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#C9A66B] bg-[#C9A66B]/10 px-2 py-1 rounded-md border border-[#C9A66B]/20 transition-all group-hover:bg-[#C9A66B]/20 group-hover:border-[#C9A66B]/40">
                            <Zap size={10} fill="currentColor" /> +50 PRO
                        </div>
                    </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
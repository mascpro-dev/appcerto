// Adicionamos esta linha para garantir que a página seja sempre dinâmica,
// evitando o erro de "Dynamic Server Usage" que vimos antes.
export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Play, Info, ChevronRight, Zap } from "lucide-react";

export default async function EvolucaoPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: modules } = await supabase
    .from("Module")
    .select("*")
    .order("order", { ascending: true });

  const featuredModule = modules?.[0];

  return (
    // AJUSTE GERAL: Mudamos o padding inferior (pb) e a cor de fundo.
    <div className="pb-24 bg-slate-950 min-h-screen font-sans">
      
      {/* --- 1. HERO SECTION (Destaque Estilo Netflix) --- */}
      {featuredModule && (
        // AJUSTE: Altura no mobile (h-[55vh]) e desktop (md:h-[65vh]) para mais impacto.
        <div className="relative w-full h-[55vh] md:h-[65vh] flex items-end">
          {/* Camadas de Fundo (Gradientes e Textura) */}
          <div className="absolute inset-0 bg-gradient-to-br from-masc-purple/80 via-slate-900/90 to-black opacity-90" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Conteúdo do Hero */}
          {/* AJUSTE: Aumentamos o padding lateral no mobile (p-8) e desktop (md:p-16). */}
          <div className="relative z-10 p-8 md:p-16 w-full max-w-5xl mx-auto flex flex-col items-start">
            <span className="bg-masc-gold/20 text-masc-gold border border-masc-gold/30 px-3 py-1.5 rounded-md text-xs font-bold tracking-widest uppercase mb-4 inline-block backdrop-blur-md">
              Módulo Destaque
            </span>
            {/* AJUSTE: Tamanho da fonte do título no mobile (text-4xl) e desktop (md:text-6xl). */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tighter drop-shadow-2xl max-w-3xl">
              {featuredModule.title}
            </h1>
            {/* AJUSTE: Tamanho da fonte da descrição e limite de linhas. */}
            <p className="text-slate-200 text-sm md:text-lg mb-8 max-w-2xl line-clamp-3 md:line-clamp-none drop-shadow-md font-medium">
              Domine as técnicas fundamentais e comece a acumular seus primeiros pontos PRO.
              O conhecimento transforma sua carreira.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-masc-lime text-black hover:bg-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-masc-lime/20">
                <Play fill="currentColor" size={22} />
                Assistir Agora
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:border-white/40">
                <Info size={22} />
                Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Wrapper para as Trilhas de Conteúdo --- */}
      {/* AJUSTE: Margem negativa superior (-mt-12) e espaçamento entre secções (space-y-16). Padding lateral (px-6 md:px-12). */}
      <div className="space-y-16 relative z-20 px-6 md:px-12 -mt-12 max-w-7xl mx-auto">
        
        {/* --- 2. TRILHA: Continuar Assistindo --- */}
        <section>
          <h2 className="text-white font-bold text-xl md:text-2xl mb-6 flex items-center gap-2">
            Continuar Aprendendo <ChevronRight className="text-masc-gold" size={24} />
          </h2>
          {/* AJUSTE: Padding no container de scroll para não cortar a sombra dos cards. */}
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x px-2">
             {/* Card de Exemplo */}
             <div className="min-w-[280px] md:min-w-[340px] bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 snap-start cursor-pointer hover:border-masc-blue/50 transition-all group hover:shadow-lg hover:shadow-masc-blue/10 hover:-translate-y-1">
                <div className="h-44 md:h-48 bg-slate-800/50 relative group-hover:bg-slate-800/80 transition-colors flex items-center justify-center">
                    <Play size={48} className="text-white/70 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-lg" />
                    {/* Barra de Progresso */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-700/50">
                        <div className="h-full bg-gradient-to-r from-masc-gold to-amber-300 w-[45%] shadow-[0_0_10px_rgba(201,166,107,0.5)]" />
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-slate-100 font-bold text-lg truncate leading-tight">Aula 2: Colorimetria Avançada</h3>
                    <p className="text-sm text-masc-gold font-medium mt-2 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-masc-gold animate-pulse"/>
                      Restam 15 min
                    </p>
                </div>
             </div>
          </div>
        </section>

        {/* --- 3. GRID: Jornada Completa --- */}
        <section>
          <h2 className="text-white font-bold text-xl md:text-2xl mb-6">Jornada Completa</h2>
          {/* AJUSTE: Grid responsivo (1 coluna mobile, 2 tablet, 3 desktop pequeno, 4 desktop grande). Gap ajustado (gap-6 md:gap-8). */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {modules?.map((modulo: any, index: number) => (
              <div 
                key={modulo.id} 
                className="group bg-slate-900/30 hover:bg-slate-900/80 border border-white/5 hover:border-masc-lime/30 rounded-2xl overflow-hidden transition-all hover:-translate-y-2 duration-300 hover:shadow-xl hover:shadow-masc-lime/5"
              >
                {/* Thumbnail (Capa) Gerada por CSS */}
                <div className={`h-44 w-full relative p-5 flex flex-col justify-end items-start
                    ${index % 2 === 0 ? 'bg-gradient-to-t from-masc-teal/90 via-masc-teal/50 to-slate-900/20' : 'bg-gradient-to-t from-masc-purple/90 via-masc-purple/50 to-slate-900/20'}
                `}>
                    {/* Badge do Número do Módulo */}
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-bold text-white border border-white/10 uppercase tracking-wider shadow-sm">
                        Módulo {index + 1}
                    </span>
                    {/* Ícone de Play (aparece no hover) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300">
                      <Play size={28} className="text-white ml-1" fill="currentColor" />
                    </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg leading-snug group-hover:text-masc-lime transition-colors line-clamp-2">
                    {modulo.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <div className="w-2 h-2 rounded-full bg-masc-lime animate-pulse shadow-[0_0_8px_rgba(166,206,68,0.6)]" />
                        <span className="uppercase tracking-wider">Fundamental</span>
                    </div>
                    {/* Badge de PROs */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-masc-gold bg-masc-gold/10 px-3 py-1.5 rounded-lg border border-masc-gold/20 transition-all group-hover:bg-masc-gold/20 group-hover:border-masc-gold/40">
                        <Zap size={12} fill="currentColor" /> +50 PRO
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
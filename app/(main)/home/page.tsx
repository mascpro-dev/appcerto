// --- A LINHA MÁGICA ESTÁ AQUI EMBAIXO ---
export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Trophy, Star, ArrowUpRight, Shield, TrendingUp } from "lucide-react";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id)
    .single();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Olá, {profile?.full_name || "Membro MASC"}
          </h1>
          <p className="text-masc-bone/60">
            Seu progresso é recompensado.
          </p>
        </div>
        
        {profile?.role === 'admin' && (
           <span className="bg-masc-purple/20 text-masc-blue border border-masc-purple/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
             <Shield size={12} /> Admin Mode
           </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD PRO - ESTILO BLACK/GOLD */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 via-black to-slate-950 rounded-2xl p-8 border border-masc-gold/30 relative overflow-hidden group shadow-2xl">
          {/* Brilho Dourado de Fundo */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-masc-gold/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-masc-gold mb-2 bg-masc-gold/10 px-3 py-1 rounded-full border border-masc-gold/20 w-fit">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold tracking-widest text-[10px] uppercase">Masc Coin</span>
                </div>
                <Trophy className="text-masc-gold/20 group-hover:text-masc-gold/40 transition-colors" size={40} />
            </div>
            
            <div>
                <div className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg">
                {profile?.pro_balance || 0} <span className="text-2xl text-slate-500 font-medium">PRO</span>
                </div>
                <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                    <TrendingUp size={14} className="text-masc-lime" />
                    Seu poder de compra na loja.
                </p>
            </div>
          </div>
        </div>

        {/* CARD PRÓXIMO NÍVEL - ESTILO ROXO */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-masc-purple/50 transition-colors relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-masc-purple/5 to-transparent pointer-events-none"></div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Próxima Placa</h3>
            <p className="text-masc-blue text-sm font-medium">Marco de 10k</p>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
              <span>0 PRO</span>
              <span>10.000 PRO</span>
            </div>
            <div className="w-full bg-black rounded-full h-2 border border-white/5">
              <div 
                className="bg-gradient-to-r from-masc-blue to-masc-purple h-full rounded-full" 
                style={{ width: `${Math.min(((profile?.pro_balance || 0) / 10000) * 100, 100)}%` }}
              ></div>
            </div>
             <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/5">
              Ver Placas
            </button>
          </div>
        </div>
      </div>
      
      {/* CARD DE INDICAÇÃO */}
      <div className="bg-gradient-to-r from-masc-teal/10 to-transparent border border-masc-teal/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
              <h3 className="font-bold text-white">Convite Exclusivo</h3>
              <p className="text-sm text-slate-400">Ganhe PROs convidando profissionais qualificados.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
              <code className="flex-1 md:flex-none bg-black border border-masc-teal/30 rounded-lg p-3 text-masc-gold font-mono text-sm tracking-wider">
                  mascpro.app/ref/{profile?.referral_code || "..."}
              </code>
              <button className="bg-masc-teal text-white px-6 py-2 rounded-lg font-bold hover:bg-masc-teal/80 transition-colors text-sm">
                  Copiar
              </button>
          </div>
      </div>
    </div>
  );
}
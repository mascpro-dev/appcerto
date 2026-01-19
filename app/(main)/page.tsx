"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trophy, Copy, CheckCircle, Wallet, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    }
    getSession();
  }, [supabase]);

  // Link com HTTPS e rota correta
  const inviteLink = `https://mascpro.app/ref/${userId || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Título de Boas-vindas */}
      <div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
          Olá, <span className="text-[#C9A66B]">Membro Fundador</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium italic">Seu progresso é recompensado.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card de Saldo PRO */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
              <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Masc Coin</span>
            </div>
            <div>
              <p className="text-6xl font-black text-white italic tracking-tighter leading-none">
                1100 <span className="text-2xl text-[#C9A66B] uppercase">Pro</span>
              </p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                <ArrowUpRight size={14} className="text-[#C9A66B]" /> Seu poder de compra na loja.
              </p>
            </div>
          </div>
        </div>

        {/* Card de Próxima Placa */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-widest italic text-slate-400">Próxima Placa</h3>
            <span className="text-[10px] text-slate-600 font-bold uppercase">Marco de 10k</span>
          </div>
          <div className="space-y-4">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#C9A66B] w-[11%] shadow-[0_0_15px_rgba(201,166,107,0.3)]" />
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <span>1100 PRO</span>
              <span>10.000 PRO</span>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Ver Placas
            </button>
          </div>
        </div>
      </div>

      {/* Box de Convite Exclusivo */}
      <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#C9A66B]/10 rounded-2xl flex items-center justify-center text-[#C9A66B]">
              <ArrowUpRight size={24} />
           </div>
           <div>
              <h3 className="font-black text-white italic uppercase tracking-tighter text-lg">Convite Exclusivo</h3>
              <p className="text-slate-500 text-sm font-medium">Ganhe PROs convidando profissionais qualificados.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto bg-black p-1 rounded-2xl border border-white/5">
          <div className="px-6 py-3 text-xs text-slate-400 font-mono truncate max-w-[200px]">
            {inviteLink}
          </div>
          <button 
            onClick={handleCopy}
            className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C9A66B] transition-all"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
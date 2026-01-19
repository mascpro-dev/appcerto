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

  const inviteLink = `https://mascpro.app/ref/${userId || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* BOAS VINDAS */}
      <div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
          Olá, <span className="text-[#C9A66B]">Membro Fundador</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Seu progresso é recompensado.</p>
      </div>

      {/* CARD DE SALDO PRO */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-white/5 p-8 rounded-[32px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
              <Wallet size={12} className="text-[#C9A66B]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Masc Coin</span>
            </div>
            <div>
              <p className="text-6xl font-black text-white italic tracking-tighter">
                1100 <span className="text-2xl text-[#C9A66B]">PRO</span>
              </p>
              <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                <ArrowUpRight size={14} /> Seu poder de compra na loja.
              </p>
            </div>
          </div>
        </div>

        {/* PRÓXIMA PLACA */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Próxima Placa</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Marco de 10k</span>
          </div>
          <div className="space-y-4">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#C9A66B] w-[11%] shadow-[0_0_15px_rgba(201,166,107,0.4)]" />
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>1100 PRO</span>
              <span>10.000 PRO</span>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Ver Placas
            </button>
          </div>
        </div>
      </div>

      {/* CONVITE EXCLUSIVO */}
      <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-black text-white italic uppercase tracking-tighter text-lg">Convite Exclusivo</h3>
          <p className="text-slate-500 text-sm">Ganhe PROs convidando profissionais qualificados.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-black border border-white/10 px-4 py-3 rounded-xl text-xs text-slate-400 font-mono truncate">
            {inviteLink}
          </div>
          <button 
            onClick={handleCopy}
            className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-[#C9A66B] transition-all whitespace-nowrap"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
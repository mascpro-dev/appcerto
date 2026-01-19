"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Users, Copy, CheckCircle, Search, TrendingUp, UserPlus } from "lucide-react";

export default function RedePage() {
  const [indicados, setIndicados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq('invited_by', session.user.id)
          .order('created_at', { ascending: false });
        if (data) setIndicados(data);
      }
      setLoading(false);
    }
    getData();
  }, [supabase]);

  const inviteLink = typeof window !== 'undefined' && userId 
    ? `mascpro.com/?ref=${userId}`
    : "Carregando...";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* CABEÇALHO COM LINK ESTILO APENAS BORDA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Minha Rede</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie sua equipe e amplie seus ganhos.</p>
        </div>

        {/* LINK DE CONVITE - APENAS BORDA CONFORME SOLICITADO */}
        <div className="flex items-center gap-2 p-1 rounded-xl border border-[#C9A66B]/30 bg-black/40">
          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-[#C9A66B] uppercase tracking-widest">Seu link de convite</p>
            <p className="text-xs text-slate-400 font-mono">{inviteLink}</p>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-[#C9A66B] text-black px-4 py-3 rounded-lg font-bold text-xs hover:bg-[#b08d55] transition-all"
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICAS (IGUAL AO PRINT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Indicados</p>
            <p className="text-3xl font-black text-white">{indicados.length}</p>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Membros Ativos</p>
            <p className="text-3xl font-black text-white">{indicados.length}</p>
          </div>
        </div>

        {/* AJUSTE PARA "PRO" (REMOVIDO COMISSÃO ESTIMADA) */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-[#C9A66B]/10 flex items-center justify-center text-[#C9A66B]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PROs Gerados</p>
            <p className="text-3xl font-black text-white">{indicados.length * 50} <span className="text-sm font-bold text-[#C9A66B]">PRO</span></p>
          </div>
        </div>
      </div>

      {/* TABELA DE MEMBROS (IGUAL AO PRINT) */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <Users className="text-[#C9A66B]" size={20} />
            Membros da Equipe
          </h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              type="text" 
              placeholder="Buscar indicado..." 
              className="w-full bg-black border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-[#C9A66B] outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {indicados.length === 0 ? (
            <div className="p-20 text-center text-slate-600">Nenhum membro encontrado na sua rede.</div>
          ) : (
            indicados.map((membro) => (
              <div key={membro.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center font-black text-[#C9A66B] text-lg">
                    {membro.full_name?.charAt(0) || "M"}
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{membro.full_name || "Membro MASC"}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cabeleireiro • {new Date(membro.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest border border-green-500/20">
                  Ativo
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
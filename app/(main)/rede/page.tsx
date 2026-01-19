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

  // CORREÇÃO DO LINK COM HTTPS://
  const inviteLink = typeof window !== 'undefined' && userId 
    ? `https://mascpro.com/?ref=${userId}`
    : "https://mascpro.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Minha <span className="text-[#C9A66B]">Rede</span></h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie sua equipe e amplie seus ganhos.</p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl border border-[#C9A66B]/30 bg-black/40">
          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-[#C9A66B] uppercase tracking-widest">Seu link de convite</p>
            <a href={inviteLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 font-mono hover:underline">
              {inviteLink}
            </a>
          </div>
          <button onClick={handleCopy} className="bg-[#C9A66B] text-black px-4 py-3 rounded-lg font-bold text-xs hover:bg-[#b08d55] transition-all">
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><UserPlus size={24} /></div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Indicados</p><p className="text-3xl font-black text-white">{indicados.length}</p></div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-5"><div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><CheckCircle size={24} /></div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Membros Ativos</p><p className="text-3xl font-black text-white">{indicados.length}</p></div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-5"><div className="w-12 h-12 rounded-xl bg-[#C9A66B]/10 flex items-center justify-center text-[#C9A66B]"><TrendingUp size={24} /></div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PROs Gerados</p><p className="text-3xl font-black text-white">{indicados.length * 50} <span className="text-sm font-bold text-[#C9A66B]">PRO</span></p></div>
        </div>
      </div>
    </div>
  );
}
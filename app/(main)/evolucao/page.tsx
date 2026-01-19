"use client";

import Link from "next/link";
import { PlayCircle, Trophy } from "lucide-react";

const MODULOS = [
  { id: "mod_c1-blonde", title: "Módulo 1: Conteúdo Masc PRO", valendo: "50 PRO", slug: "blonde" },
  { id: "mod_c1-curls", title: "Módulo 1: Conteúdo Masc PRO", valendo: "50 PRO", slug: "curls" },
  { id: "mod_c1-repair", title: "Módulo 1: Conteúdo Masc PRO", valendo: "50 PRO", slug: "repair" },
];

export default function EvolucaoPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Evolução <span className="text-[#C9A66B]">PRO</span></h1>
          <p className="text-slate-500 text-sm">Invista seus PROs para desbloquear conhecimento.</p>
        </div>
        <div className="bg-black border border-[#C9A66B]/30 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-[0_0_20px_rgba(201,166,107,0.1)]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seu Saldo</p>
          <p className="text-xl font-black text-white">1.000.000 <span className="text-[#C9A66B]">PRO</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MODULOS.map((mod) => (
          <Link key={mod.id} href={`/evolucao/${mod.id}`} className="group bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-[#C9A66B]/30 transition-all">
            <div className="aspect-video bg-zinc-900 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-[#C9A66B] uppercase border border-white/10 z-10">
                  {mod.id.toUpperCase()}
               </div>
               <PlayCircle size={48} className="text-white/20 group-hover:text-[#C9A66B] transition-colors" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-white mb-4 leading-tight">{mod.title}</h3>
              <div className="flex items-center gap-2 text-[#C9A66B] text-[10px] font-black uppercase">
                 <Trophy size={14} /> Ganhe {mod.valendo}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { PlayCircle, Trophy } from "lucide-react";

const MODULOS = [
  { id: "blonde", title: "Módulo Especialista: Blonde PRO", valendo: "50 PRO" },
  { id: "curls", title: "Módulo Especialista: Curls PRO", valendo: "50 PRO" },
  { id: "repair", title: "Módulo Especialista: Repair PRO", valendo: "50 PRO" },
];

export default function EvolucaoPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Evolução <span className="text-[#C9A66B]">PRO</span></h1>
        <div className="bg-[#0A0A0A] border border-[#C9A66B]/30 px-6 py-3 rounded-2xl flex items-center gap-4">
          <p className="text-xl font-black text-white italic uppercase tracking-tighter">1100 <span className="text-[#C9A66B]">PRO</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MODULOS.map((mod) => (
          <Link key={mod.id} href={`/aula/${mod.id}`} className="group bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-[#C9A66B]/30 transition-all">
            <div className="aspect-video bg-zinc-900 flex items-center justify-center relative">
               <PlayCircle size={48} className="text-white/20 group-hover:text-[#C9A66B] transition-colors" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-white mb-4 uppercase tracking-tighter italic">{mod.title}</h3>
              <div className="flex items-center gap-2 text-[#C9A66B] text-[10px] font-black uppercase"><Trophy size={14} /> Ganhe {mod.valendo}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
"use client";

import { CheckCircle, Lock, Star } from "lucide-react";

const STEPS = [
  { id: 1, title: "Membro Fundador", description: "Início da caminhada", status: "concluido" },
  { id: 2, title: "Embaixador MASC", description: "Primeiros indicados ativos", status: "atual" },
  { id: 3, title: "Líder de Rede", description: "Rede em expansão", status: "bloqueado" },
];

export default function JornadaPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
          Jornada do <span className="text-[#C9A66B]">Embaixador</span>
        </h1>
        <p className="text-slate-500 mt-1">Sua trajetória rumo ao topo do ecossistema MASC.</p>
      </div>

      <div className="grid gap-4">
        {STEPS.map((step) => (
          <div 
            key={step.id}
            className={`p-6 rounded-2xl border ${
              step.status === 'concluido' ? 'border-green-500/20 bg-green-500/5' : 
              step.status === 'atual' ? 'border-[#C9A66B] bg-[#C9A66B]/5' : 'border-white/5 bg-[#0A0A0A]'
            } flex items-center justify-between`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step.status === 'concluido' ? 'bg-green-500 text-black' : 
                step.status === 'atual' ? 'bg-[#C9A66B] text-black' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {step.status === 'concluido' ? <CheckCircle size={24} /> : <Star size={24} />}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{step.title}</p>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
            {step.status === 'bloqueado' && <Lock size={20} className="text-zinc-700" />}
          </div>
        ))}
      </div>
    </div>
  );
}
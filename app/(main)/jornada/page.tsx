"use client";

import { Shield, Star, Award, GraduationCap, Lock, Zap, Target, Users, ShoppingCart, ShieldCheck } from "lucide-react";

export default function JornadaPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      
      {/* SEÇÃO 1: HIERARQUIA DE AUTORIDADE */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
            Minha <span className="text-[#C9A66B]">Jornada</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Progressão formal e autoridade real no ecossistema MASC PRO.</p>
        </div>

        <div className="grid gap-4">
          {[
            { title: "CERTIFIED", icon: Shield, status: "concluido", desc: "Fundação técnica e cultural." },
            { title: "EXPERT", icon: Star, status: "atual", desc: "Domínio avançado e consistência." },
            { title: "MASTER TÉCNICO", icon: Award, status: "bloqueado", desc: "Autoridade técnica reconhecida." },
            { title: "EDUCADOR MASC PRO", icon: GraduationCap, status: "bloqueado", desc: "Formador de novos líderes." }
          ].map((nivel) => (
            <div key={nivel.title} className={`p-5 rounded-2xl border ${nivel.status === 'bloqueado' ? 'border-white/5 bg-black/40' : 'border-[#C9A66B]/20 bg-[#C9A66B]/5'} flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${nivel.status === 'bloqueado' ? 'bg-zinc-900 text-zinc-700' : 'bg-[#C9A66B] text-black'}`}>
                  <nivel.icon size={24} />
                </div>
                <div>
                  <h3 className={`font-black italic tracking-tighter ${nivel.status === 'bloqueado' ? 'text-zinc-600' : 'text-white'}`}>{nivel.title}</h3>
                  <p className="text-xs text-slate-500">{nivel.desc}</p>
                </div>
              </div>
              {nivel.status === 'bloqueado' && <Lock size={16} className="text-zinc-800" />}
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 2: REGRAS DE GAMIFICAÇÃO PROPORCIONAL */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Inteligência <span className="text-[#C9A66B]">PRO</span></h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cabeleireiro */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 space-y-6">
            <span className="text-[#C9A66B] text-[10px] font-black uppercase border border-[#C9A66B]/30 px-3 py-1 rounded-full">Cabeleireiro</span>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start text-xs"><Target size={16} className="text-blue-400 shrink-0" /> Constância e aplicação técnica.</li>
              <li className="flex gap-3 items-start text-xs"><Users size={16} className="text-blue-400 shrink-0" /> Indicação e Evolução individual.</li>
              <li className="flex gap-3 items-start text-xs"><ShoppingCart size={16} className="text-blue-400 shrink-0" /> Compra de produtos oficiais.</li>
            </ul>
          </div>

          {/* Embaixador */}
          <div className="bg-[#0A0A0A] border border-[#C9A66B]/20 rounded-3xl p-6 space-y-6 shadow-[0_0_30px_rgba(201,166,107,0.02)]">
            <span className="bg-[#C9A66B] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">Embaixador</span>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start text-xs"><Star size={16} className="text-[#C9A66B] shrink-0" /> Responsabilidade e formação de outros.</li>
              <li className="flex gap-3 items-start text-xs"><ShieldCheck size={16} className="text-[#C9A66B] shrink-0" /> Entrega educacional e representação.</li>
              <li className="flex gap-3 items-start text-xs"><ShoppingCart size={16} className="text-[#C9A66B] shrink-0" /> Compra de produtos oficiais.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center p-6 border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Aqui o título pesa. Não é pontinho infantil.</p>
      </div>
    </div>
  );
}
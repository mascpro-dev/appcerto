"use client";

import { Shield, Star, Award, GraduationCap, CheckCircle2, Lock, ChevronRight } from "lucide-react";

const NIVEIS = [
  {
    id: "certified",
    title: "CERTIFIED",
    icon: Shield,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    status: "concluido",
    desc: "Fundação técnica e alinhamento com a cultura MASC PRO.",
    entrega: "Avaliação teórica concluída",
    responsabilidade: "Aplicação do método padrão",
    beneficio: "Selo de Membro Verificado"
  },
  {
    id: "expert",
    title: "EXPERT",
    icon: Star,
    color: "text-[#C9A66B]",
    bg: "bg-[#C9A66B]/10",
    border: "border-[#C9A66B]/30",
    status: "atual",
    desc: "Domínio técnico avançado e consistência nos resultados.",
    entrega: "Prova prática + Portfólio de entregas",
    responsabilidade: "Auxílio a membros Certified",
    beneficio: "Prioridade no suporte + Badge Expert"
  },
  {
    id: "master",
    title: "MASTER TÉCNICO",
    icon: Award,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    status: "bloqueado",
    desc: "Autoridade técnica reconhecida no ecossistema.",
    entrega: "Avaliação técnica presencial/vídeo",
    responsabilidade: "Revisão de processos da rede",
    beneficio: "Participação em lucros de produtos"
  },
  {
    id: "educador",
    title: "EDUCADOR MASC PRO",
    icon: GraduationCap,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    status: "bloqueado",
    desc: "O topo da hierarquia. Formador de novos líderes.",
    entrega: "Capacidade didática + Entrega de novos Experts",
    responsabilidade: "Criação de conteúdos oficiais",
    beneficio: "Acesso ao conselho + Royalties educacionais"
  }
];

export default function JornadaPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* CABEÇALHO DE AUTORIDADE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111] to-black border border-white/5 p-8">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Minha <span className="text-[#C9A66B]">Jornada</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-md font-medium">
            Aqui o título pesa. Progressão baseada em mérito, avaliação formal e responsabilidade real.
          </p>
          <div className="mt-6 flex gap-4">
            <div className="bg-[#C9A66B] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Identidade Ativa
            </div>
          </div>
        </div>
      </div>

      {/* ÁRVORE DE PROGRESSÃO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Níveis de Autoridade</h3>
            <span className="text-[10px] text-[#C9A66B] font-bold">REGRAS DE OURO: SEM COMPRA DE NÍVEL</span>
        </div>

        {NIVEIS.map((nivel, index) => (
          <div 
            key={nivel.id}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                nivel.status === 'bloqueado' ? 'border-white/5 bg-black/40 grayscale' : 
                nivel.status === 'atual' ? `${nivel.border} ${nivel.bg} shadow-[0_0_40px_rgba(201,166,107,0.05)]` : 
                'border-green-500/10 bg-green-500/5'
            }`}
          >
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${
                    nivel.status === 'bloqueado' ? 'bg-zinc-900 text-zinc-700' : 
                    nivel.status === 'atual' ? 'bg-[#C9A66B] text-black' : 'bg-green-500 text-black'
                }`}>
                  <nivel.icon size={28} strokeWidth={2.5} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-black italic tracking-tighter ${nivel.status === 'bloqueado' ? 'text-zinc-600' : 'text-white'}`}>
                        {nivel.title}
                    </h2>
                    {nivel.status === 'concluido' && <CheckCircle2 size={16} className="text-green-500" />}
                    {nivel.status === 'bloqueado' && <Lock size={14} className="text-zinc-700" />}
                  </div>
                  <p className="text-sm text-slate-500 max-w-sm">{nivel.desc}</p>
                </div>
              </div>

              {/* GRID DE REQUISITOS (SÓ APARECE SE NÃO ESTIVER BLOQUEADO OU FOR O PRÓXIMO) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Critério/Entrega</p>
                  <p className="text-xs font-bold text-slate-300">{nivel.entrega}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Responsabilidade</p>
                  <p className="text-xs font-bold text-slate-300">{nivel.responsabilidade}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Benefício Real</p>
                  <p className="text-xs font-bold text-[#C9A66B]">{nivel.beneficio}</p>
                </div>
              </div>

              <div className="hidden lg:block">
                {nivel.status === 'atual' ? (
                   <button className="bg-[#C9A66B] text-black text-[10px] font-black px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                     SOLICITAR AVALIAÇÃO
                   </button>
                ) : nivel.status === 'bloqueado' ? (
                   <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-zinc-800">
                     <ChevronRight size={20} />
                   </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NOTA DE RODAPÉ */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#050505] text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          O Reconhecimento MASC PRO é validado por prova prática e entrega real.
        </p>
      </div>
    </div>
  );
}
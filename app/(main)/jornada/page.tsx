"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CheckCircle2, Lock, Share2, Crown, Shield, Zap, TrendingUp } from "lucide-react";

// --- TRILHA 1: TÉCNICA (Baseada em PROs Totais: Ativo + Passivo) ---
const PLACAS_TECNICAS = [
  { limit: 10000, title: "Profissional em Construção", color: "text-green-500", border: "border-green-500/30", iconBg: "bg-green-500/10" },
  { limit: 50000, title: "Profissional Validado", color: "text-blue-500", border: "border-blue-500/30", iconBg: "bg-blue-500/10" },
  { limit: 150000, title: "Referência Técnica", color: "text-purple-500", border: "border-purple-500/30", iconBg: "bg-purple-500/10" },
  { limit: 250000, title: "Formador de Profissionais", color: "text-orange-500", border: "border-orange-500/30", iconBg: "bg-orange-500/10" },
  { limit: 500000, title: "Educador Masc Pro", color: "text-red-600", border: "border-red-600/30", iconBg: "bg-red-600/10" },
];

// --- TRILHA 2: EMBAIXADORES (Baseada em Indicações Diretas) ---
const NIVEIS_EMBAIXADOR = [
  { limit: 5, title: "Embaixador Start", color: "text-gray-300", border: "border-gray-500", icon: Share2, desc: "Iniciou sua rede (5 convites)." },
  { limit: 20, title: "Embaixador Bronze", color: "text-amber-700", border: "border-amber-700", icon: Shield, desc: "Influência local (20 convites)." },
  { limit: 50, title: "Embaixador Prata", color: "text-gray-400", border: "border-gray-400", icon: Shield, desc: "Líder de comunidade (50 convites)." },
  { limit: 100, title: "Embaixador Gold", color: "text-yellow-400", border: "border-yellow-400", icon: Crown, desc: "Referência no movimento (100 convites)." },
  { limit: 500, title: "Embaixador Black", color: "text-white", border: "border-white", icon: Crown, desc: "Lenda do MASC PRO (500 convites)." },
];

export default function JornadaPage() {
  const supabase = createClientComponentClient();
  
  const [totalBalance, setTotalBalance] = useState(0);
  const [referralCount, setReferralCount] = useState(0); // Número de indicados
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Busca Saldo (Atualizado para ler active_pro + passive_pro)
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) {
            const active = profile.active_pro || 0;
            const passive = profile.passive_pro || 0;
            // Fallback para colunas antigas se as novas estiverem zeradas (durante migração)
            const oldCoins = (profile.coins || 0) + (profile.personal_coins || 0);
            
            setTotalBalance(active + passive > 0 ? active + passive : oldCoins);
        }

        // 2. Busca Contagem de Convidados (Para trilha Embaixador)
        // Conta quantas pessoas têm o campo "invited_by" igual ao meu ID
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: 'exact', head: true })
          .eq("invited_by", user.id);
        
        if (!error) setReferralCount(count || 0);
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white/60">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#000000] text-white font-sans">
      
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold italic tracking-wide">
          MINHA <span className="text-[#C9A66B]">JORNADA</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Acompanhe sua evolução técnica e seu poder de influência no ecossistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* --- COLUNA ESQUERDA: TÉCNICA (PLACAS) --- */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
            <Zap className="text-[#C9A66B]" />
            <div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">Meritocracia Técnica</h2>
                <p className="text-xs text-gray-500">Baseado em PROs Acumulados</p>
            </div>
            <div className="ml-auto bg-[#111] px-3 py-1 rounded text-[#C9A66B] font-bold text-sm border border-[#222]">
                {totalBalance.toLocaleString('pt-BR')} PRO
            </div>
          </div>

          <div className="space-y-4 relative">
             {/* Linha conectora vertical */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-[#222] -z-10"></div>

            {PLACAS_TECNICAS.map((placa) => {
              const isUnlocked = totalBalance >= placa.limit;
              const previousLimit = PLACAS_TECNICAS.find(p => p.limit < placa.limit)?.limit || 0;
              const isNextPlaca = !isUnlocked && totalBalance >= previousLimit && totalBalance < placa.limit;
              
              return (
                <div 
                  key={placa.limit}
                  className={`relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${
                    isUnlocked 
                      ? `${placa.border} bg-[#0A0A0A] opacity-100` 
                      : "border-[#222] bg-black opacity-50 grayscale"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-black z-10 ${
                    isUnlocked ? `${placa.iconBg} ${placa.color}` : "bg-[#111] text-gray-600"
                  }`}>
                    {isUnlocked ? <CheckCircle2 size={18} /> : <Lock size={18} />}
                  </div>

                  <div>
                    <h3 className={`font-bold text-sm md:text-base ${isUnlocked ? placa.color : "text-gray-500"}`}>
                      {placa.title.toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Meta: {placa.limit.toLocaleString('pt-BR')} PRO
                    </p>
                  </div>
                  
                  {/* Barra de progresso individual se for a próxima placa */}
                  {isNextPlaca && (
                      <div className="absolute bottom-0 left-0 h-1 bg-[#222] w-full rounded-b-xl overflow-hidden">
                          <div 
                            className={`h-full ${placa.color.replace('text-', 'bg-')}`} 
                            style={{ width: `${((totalBalance - previousLimit) / (placa.limit - previousLimit)) * 100}%` }}
                          ></div>
                      </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* --- COLUNA DIREITA: INFLUÊNCIA (EMBAIXADORES) --- */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
            <Crown className="text-blue-400" />
            <div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">Níveis de Embaixador</h2>
                <p className="text-xs text-gray-500">Baseado em sua Rede de Indicações</p>
            </div>
            <div className="ml-auto bg-[#111] px-3 py-1 rounded text-blue-400 font-bold text-sm border border-[#222]">
                {referralCount} Convites
            </div>
          </div>

          <div className="space-y-4 relative">
             {/* Linha conectora vertical */}
             <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-[#222] -z-10"></div>

            {NIVEIS_EMBAIXADOR.map((nivel) => {
              const isUnlocked = referralCount >= nivel.limit;
              const Icon = nivel.icon;

              return (
                <div 
                  key={nivel.limit}
                  className={`relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${
                    isUnlocked 
                      ? `${nivel.border} bg-[#0A0A0A] bg-opacity-20` 
                      : "border-[#222] bg-black opacity-50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-black z-10 ${
                    isUnlocked ? `bg-white/10 ${nivel.color}` : "bg-[#111] text-gray-600"
                  }`}>
                     {isUnlocked ? <Icon size={18} /> : <Lock size={18} />}
                  </div>

                  <div>
                    <h3 className={`font-bold text-sm md:text-base ${isUnlocked ? nivel.color : "text-gray-500"}`}>
                      {nivel.title.toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Meta: {nivel.limit} Pessoas na Rede
                    </p>
                    <p className="text-[10px] text-gray-600 italic mt-0.5">
                        {nivel.desc}
                    </p>
                  </div>
                  
                  {/* Etiqueta se for o nível atual */}
                  {isUnlocked && referralCount < (NIVEIS_EMBAIXADOR.find(n => n.limit > nivel.limit)?.limit || 9999) && (
                      <div className="absolute right-4 top-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${nivel.color} ${nivel.border}`}>ATUAL</span>
                      </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

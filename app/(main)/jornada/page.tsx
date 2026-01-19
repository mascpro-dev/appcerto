"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Shield, Award, Star, GraduationCap, Lock, CheckCircle, PlayCircle, Clock } from "lucide-react";

// NÍVEIS (Mantido igual)
const LEVELS = [
  { id: "MEMBRO", label: "Membro", icon: Shield, color: "text-slate-400" },
  { id: "CERTIFIED", label: "Certified", icon: CheckCircle, color: "text-blue-400" },
  { id: "EXPERT", label: "Expert", icon: Star, color: "text-[#C9A66B]" },
  { id: "MASTER", label: "Master", icon: Award, color: "text-purple-400" },
  { id: "EDUCADOR", label: "Educador", icon: GraduationCap, color: "text-red-500" }
];

// AULAS FAKES (Para simular o retorno dos vídeos)
const AULAS = [
  { id: 1, title: "Boas Vindas ao MASC PRO", duration: "05:20", thumb: "bg-slate-800", status: "concluido" },
  { id: 2, title: "Fundamentos da Colorimetria", duration: "45:10", thumb: "bg-zinc-800", status: "pendente" },
  { id: 3, title: "Técnicas de Venda no Salão", duration: "32:00", thumb: "bg-zinc-800", status: "bloqueado" },
];

export default function JornadaPage() {
  const [currentLevel, setCurrentLevel] = useState("MEMBRO");
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from("profiles").select("current_level").eq("id", session.user.id).single();
        if (data?.current_level) setCurrentLevel(data.current_level.toUpperCase());
      }
      setLoading(false);
    }
    getData();
  }, [supabase]);

  const currentIndex = LEVELS.findIndex(l => l.id.includes(currentLevel)) !== -1 
    ? LEVELS.findIndex(l => l.id.includes(currentLevel)) 
    : 0;

  if (loading) return <div className="p-12 text-slate-500">Carregando...</div>;

  return (
    <div className="space-y-12 animate-in fade-in pb-24">
      
      {/* --- SEÇÃO 1: EVOLUÇÃO (STATUS) --- */}
      <div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter mb-6">
            SUA <span className="text-[#C9A66B]">EVOLUÇÃO</span>
          </h1>
          
          {/* Barra de Progresso Visual */}
          <div className="relative flex justify-between items-center px-2">
            {/* Linha de fundo */}
            <div className="absolute left-0 top-1/2 w-full h-1 bg-white/10 -z-10 rounded-full"></div>
            {/* Linha de progresso (Dourada) */}
            <div 
                className="absolute left-0 top-1/2 h-1 bg-[#C9A66B] -z-10 rounded-full transition-all duration-1000"
                style={{ width: `${(currentIndex / (LEVELS.length - 1)) * 100}%` }}
            ></div>

            {LEVELS.map((level, index) => {
                const Icon = level.icon;
                const isUnlocked = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div key={level.id} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-black transition-all
                            ${isCurrent ? 'border-[#C9A66B] scale-125 shadow-[0_0_15px_rgba(201,166,107,0.5)]' : 
                              isUnlocked ? 'border-[#C9A66B] text-[#C9A66B]' : 'border-slate-700 text-slate-700'}
                        `}>
                            <Icon size={isCurrent ? 18 : 14} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-[#C9A66B]' : 'text-slate-600'}`}>
                            {level.label}
                        </span>
                    </div>
                );
            })}
          </div>
      </div>

      {/* --- SEÇÃO 2: SALA DE AULA (VÍDEOS) --- */}
      <div>
         <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlayCircle className="text-[#C9A66B]" />
                Sala de Aula
             </h2>
             <span className="text-xs text-slate-500">Módulo: Fundamentos</span>
         </div>

         <div className="grid gap-4">
            {AULAS.map((aula) => (
                <div key={aula.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex gap-4 hover:border-white/10 transition-all cursor-pointer group">
                    {/* Thumbnail Fake */}
                    <div className={`w-24 h-16 rounded-lg ${aula.thumb} flex items-center justify-center relative`}>
                        {aula.status === 'bloqueado' ? <Lock size={16} className="text-slate-500" /> : <PlayCircle size={24} className="text-white opacity-80 group-hover:scale-110 transition-transform" />}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                        <h3 className={`font-bold text-sm ${aula.status === 'bloqueado' ? 'text-slate-500' : 'text-white'}`}>
                            {aula.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Clock size={10} /> {aula.duration}
                            </span>
                            {aula.status === 'concluido' && (
                                <span className="text-[10px] text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded">
                                    <CheckCircle size={10} /> Assistido
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
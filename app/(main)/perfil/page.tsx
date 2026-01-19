"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { User, MapPin, Briefcase, Scissors, Edit, ShieldCheck } from "lucide-react";

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        setProfile(data);
      }
      setLoading(false);
    }
    getData();
  }, [supabase]);

  if (loading) return <div className="p-12 text-slate-500">Carregando perfil...</div>;

  const isDistribuidor = profile?.role === 'distribuidor';
  
  // Lógica inteligente para o endereço
  const enderecoCompleto = [profile?.city, profile?.state].filter(Boolean).join(" - ");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic">MEU <span className="text-[#C9A66B]">PERFIL</span></h1>
            <p className="text-slate-400">Gerencie seus dados e status profissional.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Edit size={14} /> Editar Dados
        </button>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-[#C9A66B]/5 blur-3xl rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              
              {/* AVATAR */}
              <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-[#C9A66B]/20 bg-black flex items-center justify-center relative overflow-hidden">
                      <User size={48} className="text-slate-500" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-[#C9A66B] p-2 rounded-full text-black border-4 border-[#0A0A0A]">
                      <Edit size={14} />
                  </div>
              </div>

              {/* DADOS */}
              <div className="text-center md:text-left space-y-2">
                  
                  {/* SÓ MOSTRA ETIQUETA SE TIVER NÍVEL NO BANCO */}
                  {profile?.current_level && (
                    <div className="inline-flex items-center gap-1 bg-[#C9A66B]/10 border border-[#C9A66B]/20 px-3 py-1 rounded-full text-[#C9A66B] text-[10px] font-black uppercase tracking-widest mb-1">
                        <ShieldCheck size={10} />
                        {profile.current_level}
                    </div>
                  )}

                  <h2 className="text-4xl font-black text-white tracking-tighter">
                      {profile?.full_name || "Usuário"}
                  </h2>

                  <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium">
                      {isDistribuidor ? <Briefcase size={16} className="text-[#C9A66B]"/> : <Scissors size={16} className="text-slate-400"/>}
                      <span>
                          {isDistribuidor ? "Distribuidor Autorizado" : "Cabeleireiro Profissional"}
                      </span>
                  </div>

                  <div className="pt-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Saldo Atual</p>
                      <p className="text-2xl font-black text-white">{profile?.pro_balance || 0} PRO</p>
                  </div>
              </div>
          </div>
      </div>

      {/* GRID INFERIOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD DE CONTATO */}
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[#C9A66B] font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Briefcase size={14} /> Detalhes Profissionais
              </h3>
              
              <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-500 text-sm">Função</span>
                      <span className="text-white font-bold text-sm capitalize">{profile?.role || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-500 text-sm">Instagram</span>
                      <span className="text-white font-bold text-sm">{profile?.instagram || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-500 text-sm">WhatsApp</span>
                      <span className="text-white font-bold text-sm">{profile?.whatsapp || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-500 text-sm">CPF</span>
                      <span className="text-white font-bold text-sm">{profile?.cpf || "-"}</span>
                  </div>
              </div>
          </div>

          {/* CARD DE LOCALIZAÇÃO */}
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[#C9A66B] font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                  <MapPin size={14} /> Localização
              </h3>
              
              {enderecoCompleto ? (
                  <div className="space-y-4 animate-in fade-in">
                      <div className="h-20 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                          <p className="text-white font-bold">{enderecoCompleto}</p>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-3">
                         <span className="text-slate-500 text-sm">Cidade</span>
                         <span className="text-white text-sm">{profile?.city}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-3">
                         <span className="text-slate-500 text-sm">Estado</span>
                         <span className="text-white text-sm">{profile?.state}</span>
                      </div>
                  </div>
              ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-center text-slate-600 border border-dashed border-white/10 rounded-xl bg-white/5">
                      <p className="text-sm font-medium">Endereço não cadastrado</p>
                      <button className="text-xs text-[#C9A66B] font-bold mt-2 hover:underline">
                          Adicionar Endereço
                      </button>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
}
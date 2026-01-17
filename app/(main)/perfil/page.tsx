export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { User, Mail, Shield, Wallet } from "lucide-react";

export default async function PerfilPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // Busca o perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id)
    .single();

  const balance = profile?.pro_balance ?? 0;
  const fullName = profile?.full_name || "Usuário sem Nome";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">
          MEU <span className="text-[#C9A66B]">PERFIL</span>
        </h1>
        <p className="text-slate-400 mt-2">Gerencie sua conta e seus ganhos.</p>
      </div>

      {/* CARTÃO DO USUÁRIO */}
      <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        
        {/* Avatar Simulado */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C9A66B] to-black p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <User size={64} className="text-[#C9A66B]" />
            </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mt-1">
                    <Mail size={14} />
                    <span className="text-sm">{session?.user?.email}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Shield size={16} className="text-[#C9A66B]" />
                    <span className="text-xs font-bold text-white uppercase">Membro Fundador</span>
                </div>
                <div className="bg-[#C9A66B]/10 border border-[#C9A66B]/20 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Wallet size={16} className="text-[#C9A66B]" />
                    <span className="text-xs font-bold text-[#C9A66B] uppercase">{balance} PRO ACUMULADOS</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- ÁREA DE DIAGNÓSTICO --- */}
      <div className="bg-black border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Status da Conta</h3>
          
          <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500">ID do Usuário:</span>
                  <span className="text-slate-300">{session?.user?.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500">Tabela Conectada:</span>
                  <span className={profile ? "text-green-500" : "text-red-500"}>
                      {profile ? "SIM (Conectado)" : "NÃO (Erro de conexão)"}
                  </span>
              </div>
              <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Saldo Atual:</span>
                  <span className="text-white font-bold">{balance}</span>
              </div>
          </div>
      </div>

    </div>
  );
}
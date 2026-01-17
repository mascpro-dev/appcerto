export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Trophy, TrendingUp, Users, Copy, Check } from "lucide-react";
import ClientCopyButton from "./embaixador/ClientCopyButton"; // Reusando o botão

export default async function VisaoGeralPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // 1. Pega usuário atual
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
      return <div className="p-8 text-white">Carregando...</div>
  }

  // 2. Busca dados do perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // 3. Gera o Link de Indicação (Pega o ID do usuário)
  // IMPORTANTE: Ajuste a URL base para o seu domínio quando for pro ar
  const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cadastro?ref=${session.user.id}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER DE BOAS VINDAS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            VISÃO <span className="text-[#C9A66B]">GERAL</span>
          </h1>
          <p className="text-slate-400 mt-1">Bem-vindo de volta, {profile?.full_name?.split(' ')[0]}.</p>
        </div>
      </div>

      {/* --- NOVIDADE: CARD DE INDICAÇÃO VIRAL --- */}
      <div className="bg-gradient-to-r from-[#C9A66B] to-[#967d50] rounded-2xl p-1 relative overflow-hidden shadow-[0_0_30px_rgba(201,166,107,0.2)]">
          <div className="bg-black rounded-xl p-6 relative overflow-hidden">
              {/* Efeito de Fundo */}
              <div className="absolute top-0 right-0 p-20 bg-[#C9A66B] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                          <Users className="text-[#C9A66B]" size={20} />
                          <span className="text-[#C9A66B] font-bold text-xs uppercase tracking-widest border border-[#C9A66B]/30 px-2 py-1 rounded">
                              Programa de Indicação
                          </span>
                      </div>
                      <h3 className="text-2xl font-black text-white italic mb-2">
                          CONSTRUA SEU EXÉRCITO <span className="text-[#C9A66B]">#MASCLOVERS</span>
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                          Compartilhe seu link exclusivo. Cada profissional que entrar pelo seu link gera 
                          <span className="text-white font-bold"> 10% de comissão em PROs</span> para você, para sempre.
                      </p>
                  </div>

                  {/* Área do Link e Botão */}
                  <div className="w-full md:w-auto flex flex-col gap-2">
                      <div className="bg-slate-900 border border-white/10 rounded-lg p-3 text-center">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Seu Link Único</p>
                          <code className="text-[#C9A66B] text-sm font-mono block mb-3 break-all">
                              {inviteLink}
                          </code>
                          <ClientCopyButton text={inviteLink} />
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* ------------------------------------------- */}

      {/* DASHBOARD EXISTENTE (Exemplo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {/* Seus cards de saldo, ranking etc iriam aqui */}
         <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
             <p className="text-slate-500 text-xs font-bold uppercase">Seu Saldo</p>
             <p className="text-3xl font-black text-white mt-2">{profile?.pro_balance || 0} PRO</p>
         </div>
         {/* ... */}
      </div>

    </div>
  );
}
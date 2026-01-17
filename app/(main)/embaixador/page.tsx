export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Users, Copy, Trophy, Target } from "lucide-react";
import ClientCopyButton from "./ClientCopyButton"; // Vamos criar esse botãozinho já já

export default async function EmbaixadorPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return <div className="text-white">Faça login.</div>;

  // 1. Busca os dados do usuário atual
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // 2. Busca quem ESTE usuário indicou (Seus Recrutas)
  const { data: recruits } = await supabase
    .from("profiles")
    .select("*")
    .eq("referred_by", session.user.id);

  // O Link Único (Montado com o ID do usuário)
  // IMPORTANTE: Troque 'http://localhost:3000' pelo seu domínio real quando for pro ar
  // Ou melhor: usamos headers() para pegar automático, mas por simplificação:
  const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cadastro?ref=${session.user.id}`;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* CABEÇALHO */}
      <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            ÁREA <span className="text-[#C9A66B]">EMBAIXADOR</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Indique profissionais, ganhe 10% de tudo que eles produzirem.
          </p>
      </div>

      {/* CARD DO LINK (Dourado) */}
      <div className="bg-gradient-to-br from-[#C9A66B]/20 to-black border border-[#C9A66B] p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 bg-[#C9A66B] opacity-10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                  <h3 className="text-[#C9A66B] font-bold text-lg mb-1 uppercase tracking-widest">Seu Link Exclusivo</h3>
                  <p className="text-slate-400 text-sm mb-4">Envie este link para outros profissionais.</p>
                  
                  <div className="bg-black/50 border border-[#C9A66B]/30 rounded-lg p-3 flex items-center gap-3 font-mono text-slate-300 text-sm">
                      <span className="truncate max-w-[200px] md:max-w-md">{inviteLink}</span>
                  </div>
              </div>
              
              {/* Botão de Copiar (Client Side) */}
              <ClientCopyButton text={inviteLink} />
          </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-[#C9A66B]/20 rounded-full flex items-center justify-center text-[#C9A66B]">
                  <Users size={24} />
              </div>
              <div>
                  <p className="text-3xl font-black text-white">{recruits?.length || 0}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">Indicados</p>
              </div>
          </div>
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <Trophy size={24} />
              </div>
              <div>
                  {/* Aqui você pode somar o total ganho com indicações no futuro */}
                  <p className="text-3xl font-black text-white">Ativo</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">Comissão 10%</p>
              </div>
          </div>
      </div>

      {/* LISTA DE INDICADOS */}
      <div>
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Target size={20} className="text-[#C9A66B]" /> 
              Seu Exército
          </h3>
          
          <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
              {recruits && recruits.length > 0 ? (
                  <div className="divide-y divide-white/5">
                      {recruits.map((recruit) => (
                          <div key={recruit.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/10">
                                      {recruit.full_name?.charAt(0) || "?"}
                                  </div>
                                  <div>
                                      <p className="text-white font-bold text-sm">{recruit.full_name || "Usuário"}</p>
                                      <p className="text-xs text-slate-500">Entrou via indicação</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className="text-[#C9A66B] font-mono font-bold text-sm">{recruit.pro_balance} PRO</span>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="p-10 text-center">
                      <p className="text-slate-500">Você ainda não indicou ninguém.</p>
                      <p className="text-slate-600 text-sm mt-1">Copie seu link acima e comece a formar seu time!</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
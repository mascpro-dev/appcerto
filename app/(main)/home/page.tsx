import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Trophy, Star, ArrowUpRight, Shield } from "lucide-react";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Pega o usuário logado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 2. Busca os dados do perfil (Saldo, Nome, Role)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id)
    .single();

  return (
    <div className="space-y-8">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Olá, {profile?.full_name || "Membro MASC"}
          </h1>
          <p className="text-slate-400">
            Bem-vindo ao seu painel de evolução.
          </p>
        </div>
        
        {profile?.role === 'admin' && (
           <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
             <Shield size={12} /> Admin Access
           </span>
        )}
      </div>

      {/* CARD PRINCIPAL - SALDO PRO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-8 border border-blue-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-300 mb-2">
              <Star size={18} fill="currentColor" />
              <span className="font-bold tracking-widest text-xs uppercase">Seu Saldo PRO</span>
            </div>
            <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">
              {profile?.pro_balance || 0}
            </div>
            <p className="text-blue-200/60 text-sm mt-2 max-w-md">
              Use seus PROs para desbloquear eventos exclusivos e descontos na loja.
            </p>
          </div>
        </div>

        {/* CARD SECUNDÁRIO - PRÓXIMO NÍVEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Próxima Conquista</h3>
            <p className="text-slate-400 text-sm">Placa de Prata</p>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Progresso</span>
              <span>10%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-[10%]"></div>
            </div>
             <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              Ver Detalhes <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* ÁREA DE CONVITE RÁPIDO */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Seu Link de Indicação</h3>
          <div className="flex gap-2">
              <code className="flex-1 bg-black border border-slate-800 rounded-lg p-3 text-slate-300 font-mono text-sm">
                  https://mascpro.app/signup?ref={profile?.referral_code || "..."}
              </code>
              <button className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                  Copiar
              </button>
          </div>
      </div>
    </div>
  );
}
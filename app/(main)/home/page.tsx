export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Trophy } from "lucide-react";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Pega a sessão do usuário
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Tenta buscar o perfil no banco
  let profile = null;
  let dbError = null;

  if (session) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    
    profile = data;
    dbError = error;
  }

  // Define valores padrão caso falhe
  const balance = profile?.pro_balance ?? 0;
  const userName = profile?.full_name || "Membro MASC";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* --- ÁREA DE DEBUG (MODO DETETIVE) --- */}
      {/* Tire um print desta caixa preta e me mande! */}
      <div className="bg-red-900/80 p-6 rounded-xl border-2 border-red-500 text-white font-mono text-xs overflow-auto">
        <h3 className="font-bold text-lg mb-2">🕵️‍♂️ PAINEL DE INVESTIGAÇÃO</h3>
        <p><strong>1. Usuário Logado?</strong> {session ? "SIM" : "NÃO"}</p>
        <p><strong>2. ID do Usuário:</strong> {session?.user?.id}</p>
        <p><strong>3. Erro do Banco:</strong> {dbError ? JSON.stringify(dbError) : "Nenhum erro"}</p>
        <p><strong>4. Dados do Perfil Encontrados:</strong></p>
        <pre className="bg-black p-4 rounded mt-2 text-green-400">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
      {/* ------------------------------------- */}

      {/* CABEÇALHO */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tighter">
          Olá, {userName}
        </h1>
      </div>

      {/* CARTÃO DE SALDO */}
      <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy size={120} />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-white tracking-tighter">
                        {balance}
                    </span>
                    <span className="text-xl font-bold text-slate-500">PRO</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">Saldo Real (Vindo do Banco)</p>
            </div>
      </div>
    </div>
  );
}
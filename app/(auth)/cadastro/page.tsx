"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  // Estado para os novos campos profissionais
  const [workType, setWorkType] = useState("proprio");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Captura o ID do indicador salvo pelo Layout no navegador
      const referrerId = typeof window !== "undefined" ? localStorage.getItem("masc_referrer") : null;

      // 2. Realiza o cadastro enviando os dados completos para o banco
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            work_type: workType, // Salva se é salão próprio, cadeira ou comissão
            invited_by: referrerId, // Vincula à rede de quem indicou
            coins: 50, // Garante os 50 PRO iniciais
            onboarding_completed: false
          },
        },
      });

      if (signUpError) throw signUpError;
      
      // 3. Limpa o indicador do navegador após o sucesso
      if (referrerId) localStorage.removeItem("masc_referrer");

      // 4. Redireciona para o onboarding do novo usuário
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            MASC<span className="text-[#C9A66B]">PRO</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">Crie sua conta profissional.</p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
            <input
              type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-[#C9A66B] transition-all"
              placeholder="Seu nome"
            />
          </div>

          {/* NOVOS CAMPOS: Atuação Profissional */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Atuação Profissional</label>
            <select 
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#C9A66B] transition-all appearance-none cursor-pointer"
            >
              <option value="proprio">Possuo Salão Próprio</option>
              <option value="aluguel">Alugo Cadeira</option>
              <option value="comissao">Trabalho por Comissão</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-[#C9A66B] transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Senha</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-[#C9A66B] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#C9A66B] text-black font-black py-5 rounded-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Processando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Já tem conta? <Link href="/login" className="text-[#C9A66B] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
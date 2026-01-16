"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Acesso negado. Verifique suas credenciais.");
      setLoading(false);
    } else {
      router.refresh();
      router.push("/home");
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden max-w-md w-full mx-auto">
      {/* Detalhe de Design: Glow no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent opacity-50"></div>

      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#C9A66B] mb-2">
            <Lock size={10} /> Área Restrita
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Bem-vindo</h2>
        <p className="text-slate-400 text-sm">
          Insira suas credenciais de membro.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-4">
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all placeholder:text-slate-600"
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all placeholder:text-slate-600"
                required
            />
        </div>

        {error && (
          <div className="text-red-400 text-xs text-center bg-red-950/30 border border-red-900/50 p-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* --- AQUI ESTÁ A CORREÇÃO DA COR --- */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#A6CE44] hover:bg-[#95b93d] text-black font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(166,206,68,0.2)]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 
          <>Entrar no Hub <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="py-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
          <span className="bg-transparent px-2 text-slate-500 font-bold">Convites</span>
        </div>
      </div>

      <Link 
        href="https://wa.me/5514991570389?text=Sou%20cabeleireiro(a)%20e%20gostaria%20de%20solicitar%20acesso%20ao%20MASC%20PRO"
        target="_blank"
        className="block w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10 hover:border-white/20 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wide text-center"
      >
        Pedir Link no WhatsApp
      </Link>
    </div>
  );
}
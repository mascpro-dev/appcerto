"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { CheckCircle, Zap, Loader2, Lock } from "lucide-react"; // Importei o cadeado
import { useRouter } from "next/navigation";

// Adicionei uma propriedade 'locked' opcional para o futuro
export default function LessonButton({ amount, locked = false }: { amount: number, locked?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleCollect = async () => {
    if (locked) return; // Se estiver travado, não faz nada
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setLoading(false);
        return;
    }

    // Busca saldo atual
    const { data: profile } = await supabase
        .from('profiles')
        .select('pro_balance')
        .eq('id', user.id)
        .single();
    
    const newBalance = (profile?.pro_balance || 0) + amount;

    const { error } = await supabase
        .from('profiles')
        .update({ pro_balance: newBalance })
        .eq('id', user.id);

    if (!error) {
      setCompleted(true);
      router.refresh(); 
    } else {
      alert("Erro ao resgatar. Tente novamente.");
    }
    setLoading(false);
  };

  // 1. ESTADO: JÁ RESGATADO
  if (completed) {
    return (
      <button disabled className="w-full flex-1 border border-green-500 text-green-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-default bg-transparent opacity-50">
        <CheckCircle size={20} />
        Resgatado (+{amount} PRO)
      </button>
    );
  }

  // 2. ESTADO: TRAVADO (VÍDEO NÃO TERMINOU)
  if (locked) {
      return (
        <button disabled className="w-full flex-1 border border-slate-700 text-slate-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed bg-transparent opacity-50">
            <Lock size={20} />
            Assista até o final para liberar
        </button>
      );
  }

  // 3. ESTADO: DISPONÍVEL (BOTÃO NORMAL)
  return (
    <button 
      onClick={handleCollect}
      disabled={loading}
      className="w-full flex-1 group bg-transparent hover:bg-[#A6CE44]/10 border border-[#A6CE44] text-[#A6CE44] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(166,206,68,0.1)] hover:shadow-[0_0_20px_rgba(166,206,68,0.3)]"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
            <Zap size={20} className="group-hover:scale-110 transition-transform" /> 
            RESGATAR +{amount} PRO
        </>
      )}
    </button>
  );
}
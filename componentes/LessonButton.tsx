"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { CheckCircle, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LessonButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleCollect = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Busca saldo atual
    const { data: profile } = await supabase
        .from('profiles')
        .select('pro_balance')
        .eq('id', user.id)
        .single();
    
    // Soma +50
    const newBalance = (profile?.pro_balance || 0) + amount;

    // Atualiza
    const { error } = await supabase
        .from('profiles')
        .update({ pro_balance: newBalance })
        .eq('id', user.id);

    if (!error) {
      setCompleted(true);
      router.refresh(); 
    } else {
      alert("Erro ao resgatar.");
    }
    setLoading(false);
  };

  if (completed) {
    return (
      <button disabled className="flex-1 border border-green-500 text-green-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-default bg-transparent opacity-50">
        <CheckCircle size={20} />
        Resgatado (+{amount} PRO)
      </button>
    );
  }

  return (
    <button 
      onClick={handleCollect}
      disabled={loading}
      // ESTILO OUTLINE VERDE NEON
      className="flex-1 group bg-transparent hover:bg-[#A6CE44]/10 border border-[#A6CE44] text-[#A6CE44] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(166,206,68,0.1)] hover:shadow-[0_0_20px_rgba(166,206,68,0.3)]"
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
  };

  if (completed) {
    return (
      <button disabled className="flex-1 md:flex-none bg-slate-800 text-slate-400 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 cursor-default border border-slate-700">
        <CheckCircle size={20} className="text-[#A6CE44]" />
        <span>AULA CONCLUÍDA</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="flex-1 md:flex-none bg-[#A6CE44] hover:bg-[#95b93d] text-black font-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(166,206,68,0.2)] hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          <Coins size={20} strokeWidth={2.5} />
          <span>RESGATAR +{amount} PRO</span>
        </>
      )}
    </button>
  );
}
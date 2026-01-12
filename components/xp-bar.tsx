"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Trophy, Star, Crown, Zap, Loader2, Heart, CheckCircle2, Award, ShieldCheck, GraduationCap } from "lucide-react"

export default function XPBar() {
  const supabase = createClientComponentClient()
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (data) setPerfil(data)
        }
      } catch (error) {
        console.error("Erro ao carregar XP:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()

    const channel = supabase
      .channel('xp-realtime')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        (payload: any) => {
          setPerfil(payload.new)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  if (loading) return (
    <div className="h-32 w-full bg-slate-900/50 animate-pulse rounded-[32px] flex items-center justify-center">
      <Loader2 className="animate-spin text-slate-500" />
    </div>
  )

  // NOVA LÓGICA DE PATENTES MASC PRO
  const xpTotal = perfil?.xp || 0
  
  const getPatente = (xp: number) => {
    if (xp >= 200000) return { 
        nome: "EDUCADOR", 
        cor: "from-amber-600 to-yellow-400", 
        icone: <GraduationCap size={32} className="text-white" />,
        meta: 500000,
        label: "Nível Máximo"
    };
    if (xp >= 100000) return { 
        nome: "MASTER", 
        cor: "from-purple-600 to-indigo-500", 
        icone: <Crown size={32} className="text-white" />,
        meta: 200000 
    };
    if (xp >= 50000) return { 
        nome: "EXPERT", 
        cor: "from-red-600 to-orange-500", 
        icone: <ShieldCheck size={32} className="text-white" />,
        meta: 100000 
    };
    if (xp >= 30000) return { 
        nome: "CERTIFICADO", 
        cor: "from-blue-600 to-cyan-500", 
        icone: <Award size={32} className="text-white" />,
        meta: 50000 
    };
    if (xp >= 10000) return { 
        nome: "CERTIFICADO", // Primeiro nível de certificação após ser Lover
        cor: "from-emerald-600 to-teal-400", 
        icone: <CheckCircle2 size={32} className="text-white" />,
        meta: 30000 
    };
    return { 
        nome: "MASC Lovers", 
        cor: "from-pink-500 to-rose-400", 
        icone: <Heart size={32} className="text-white fill-white" />,
        meta: 10000 
    };
  }

  const patente = getPatente(xpTotal)
  const metaAtual = patente.meta
  // Cálculo de porcentagem relativo ao próximo nível
  const progressoPorcentagem = Math.min((xpTotal / metaAtual) * 100, 100)

  return (
    <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Glow de fundo dinâmico conforme a patente */}
      <div className={`absolute -right-10 -top-10 w-48 h-48 bg-gradient-to-br ${patente.cor} opacity-20 blur-[80px]`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            {/* Badge de Patente */}
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${patente.cor} flex items-center justify-center shadow-xl shadow-black/40 border border-white/20 transition-all duration-500`}>
              {patente.icone}
            </div>
            <div>
              <div className="flex items-center gap-2 text-yellow-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                <Zap size={12} className="fill-yellow-500" /> {perfil?.tipo_usuario || 'Embaixador'} Masc PRO
              </div>
              <h2 className="text-3xl font-black text-white italic leading-none tracking-tighter uppercase">
                {patente.nome}
              </h2>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Saldo de XP</span>
            <div className="text-white font-black text-2xl leading-none">
              {xpTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
            <span className="text-slate-400 italic">Evolução de Carreira</span>
            <span className="text-white">{Math.floor(progressoPorcentagem)}%</span>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[3px]">
            <div 
              className={`h-full bg-gradient-to-r ${patente.cor} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
              style={{ width: `${progressoPorcentagem}%` }}
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-4 items-center">
            <div className="flex gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.15em]">Sincronizado</p>
            </div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.15em]">
              Próxima Patente: {metaAtual.toLocaleString()} XP
            </p>
        </div>
      </div>
      
      <Star className="absolute -left-4 -bottom-4 text-white/5 w-20 h-20 -rotate-12" />
    </div>
  )
}
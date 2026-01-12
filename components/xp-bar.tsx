"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Trophy, Zap, Star } from "lucide-react"

export default function XPBar() {
  const supabase = createClientComponentClient()
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getXP = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('xp, tipo_usuario')
          .eq('id', user.id)
          .single()
        
        setPerfil(data)
      }
      setLoading(false)
    }
    getXP()
  }, [supabase])

  // Lógica de Patentes idêntica à Sidebar para manter sincronia
  const calcularNivel = (xp: number = 0) => {
    if (xp >= 200000) return { nome: "EDUCADOR", proximo: 0, progresso: 100 }
    if (xp >= 100000) return { nome: "MASTER", proximo: 200000, progresso: (xp / 200000) * 100 }
    if (xp >= 50000) return { nome: "EXPERT", proximo: 100000, progresso: (xp / 100000) * 100 }
    if (xp >= 10000 || perfil?.tipo_usuario === 'embaixador') return { nome: "CERTIFICADO", proximo: 50000, progresso: (xp / 50000) * 100 }
    return { nome: "MASC LOVER", proximo: 10000, progresso: (xp / 10000) * 100 }
  }

  const status = calcularNivel(perfil?.xp)

  if (loading) return <div className="h-24 w-full bg-slate-100 animate-pulse rounded-[32px]" />

  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-white/5">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Trophy size={80} className="text-white" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Star size={14} className="fill-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Nível Atual</span>
            </div>
            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              {status.nome}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progresso</p>
            <p className="text-xl font-black italic text-white">{Math.floor(status.progresso)}%</p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-[2px]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              style={{ width: `${status.progresso}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
            <span className="text-blue-400 flex items-center gap-1">
              <Zap size={10} /> {perfil?.xp || 0} XP ACUMULADOS
            </span>
            {status.proximo > 0 && (
              <span className="text-slate-500">Faltam {status.proximo - (perfil?.xp || 0)} XP para o próximo nível</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
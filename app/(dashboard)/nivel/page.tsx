"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trophy, Crown, Medal, Loader2, Heart, CheckCircle2, Award, ShieldCheck, GraduationCap } from "lucide-react"

export default function RankingPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Lógica de Patentes idêntica à XP Bar para manter a consistência
  const getPatente = (xp: number, tipo: string) => {
    const ehEmbaixadorNoInicio = tipo === 'embaixador' && xp < 30000;

    if (xp >= 200000) return { nome: "EDUCADOR", cor: "text-amber-500", bg: "bg-amber-500/10", icone: <GraduationCap size={14} /> };
    if (xp >= 100000) return { nome: "MASTER", cor: "text-purple-500", bg: "bg-purple-500/10", icone: <Crown size={14} /> };
    if (xp >= 50000) return { nome: "EXPERT", cor: "text-red-500", bg: "bg-red-500/10", icone: <ShieldCheck size={14} /> };
    
    if (ehEmbaixadorNoInicio || xp >= 10000) { 
        return { nome: "CERTIFICADO", cor: "text-blue-500", bg: "bg-blue-500/10", icone: <Award size={14} /> };
    }

    return { nome: "MASC Lovers", cor: "text-pink-500", bg: "bg-pink-500/10", icone: <Heart size={14} /> };
  }

  useEffect(() => {
    const fetchRanking = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('email, xp, tipo_usuario')
        .order('xp', { ascending: false })
        .limit(20)

      if (data) setLeaderboard(data)
      setLoading(false)
    }
    fetchRanking()
  }, [supabase])

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-slate-900" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold group">
            <div className="p-2 bg-white rounded-full border shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={20} />
            </div>
            <span>Voltar</span>
          </button>
          <div className="px-4 py-2 bg-slate-900 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Trophy size={14} className="text-yellow-500" /> TOP 20 MASC PRO
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic leading-none">Ranking de Elite</h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.4em]">A jornada rumo ao topo</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
          {leaderboard.map((user, index) => {
            const patente = getPatente(user.xp, user.tipo_usuario)
            const isFirst = index === 0

            return (
              <div key={user.email} className={`flex items-center justify-between p-6 border-b border-slate-50 ${isFirst ? 'bg-slate-900 text-white' : 'text-slate-900'}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-8 text-center font-black text-xl italic ${isFirst ? 'text-yellow-500' : 'text-slate-300'}`}>
                    {index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : `#${index + 1}`}
                  </div>

                  <div>
                    <p className={`font-black uppercase italic leading-none ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                      {user.email.split('@')[0]}
                    </p>
                    <div className={`flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg w-fit ${patente.bg} ${patente.cor}`}>
                      {patente.icone}
                      <span className="text-[9px] font-black tracking-wider uppercase">{patente.nome}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-black text-xl leading-none ${isFirst ? 'text-yellow-500' : 'text-slate-900'}`}>
                    {user.xp.toLocaleString()} <span className="text-[10px] opacity-50 uppercase">XP</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
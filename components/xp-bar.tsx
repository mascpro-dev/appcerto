"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Trophy, Star, Crown, Zap, Loader2 } from "lucide-react"

export default function XPBar() {
  const supabase = createClientComponentClient()
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Função para buscar os dados iniciais
    const carregarDados = async () => {
      try {
        // Buscamos o usuário de forma segura
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (data) {
            setPerfil(data)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar XP:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()

    // Escuta em tempo real (Realtime) para atualizar a barra assim que o XP subir
    const channel = supabase
      .channel('xp-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        (payload: any) => {
          setPerfil(payload.new)
        }
      )
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="h-32 w-full bg-slate-900/50 animate-pulse rounded-[32px] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-500" />
      </div>
    )
  }

  // Lógica de Gamificação
  const xpTotal = perfil?.xp || 0
  const nivel = Math.floor(xpTotal / 1000) + 1
  const xpNoNivelAtual = xpTotal % 1000
  const progressoPorcentagem = (xpNoNivelAtual / 1000) * 100

  // Definição de estilo por cargo
  const isEmbaixador = perfil?.tipo_usuario === 'embaixador'
  const corGradiente = isEmbaixador 
    ? "from-amber-500 via-yellow-400 to-amber-600" 
    : "from-blue-600 via-blue-500 to-cyan-400"

  return (
    <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Brilho de fundo para Embaixadores */}
      {isEmbaixador && (
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl" />
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${corGradiente} flex items-center justify-center shadow-lg shadow-black/20`}>
              {isEmbaixador ? (
                <Crown className="text-slate-900" size={32} />
              ) : (
                <Trophy className="text-white" size={28} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-yellow-500 font-black text-[10px] uppercase tracking-[0.2em]">
                <Zap size={12} className="fill-yellow-500" /> 
                {perfil?.tipo_usuario || 'Membro'} Masc PRO
              </div>
              <h2 className="text-3xl font-black text-white italic leading-none">
                LVL {nivel}
              </h2>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total XP</span>
            <div className="text-white font-black text-xl leading-none">
              {xpTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
            <span className="text-slate-400 italic">Próximo Nível</span>
            <span className="text-white font-mono">{Math.floor(progressoPorcentagem)}%</span>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[3px]">
            <div 
              className={`h-full bg-gradient-to-r ${corGradiente} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(234,179,8,0.2)]`}
              style={{ width: `${progressoPorcentagem}%` }}
            />
          </div>
        </div>
        
        <p className="text-slate-500 text-[9px] mt-4 font-bold uppercase tracking-[0.15em] text-center">
          {isEmbaixador 
            ? "Bônus de 50% XP Ativo para Embaixadores" 
            : "Complete cursos para subir de nível"}
        </p>
      </div>
      
      {/* Marca d'água de fundo */}
      <Star className="absolute -right-4 -top-4 text-white/5 w-24 h-24 rotate-12" />
    </div>
  )
}
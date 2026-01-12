"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Clock, Loader2, PlayCircle } from "lucide-react"
import XPModal from "@/components/xp-modal"

export default function CoursePlayerPage() {
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClientComponentClient()

  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [secondsActive, setSecondsActive] = useState(0)
  const [showXPModal, setShowXPModal] = useState(false)
  const [xpGanho, setXpGanho] = useState(0)

  // 1. Carregar dados do curso
  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('Course')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) setCourse(data)
      setLoading(false)
    }
    fetchCourse()
  }, [id, supabase])

  // 2. Temporizador de Atividade (900 segundos = 15 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsActive((prev) => prev + 1)
    }, 1000)

    if (secondsActive >= 900) {
      adicionarXPAtividade()
      setSecondsActive(0)
    }

    return () => clearInterval(interval)
  }, [secondsActive])

  // 3. Função para adicionar XP baseada no Cargo
  const adicionarXPAtividade = async () => {
    try {
      // Método estável para pegar o usuário
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // Busca o perfil para verificar o cargo (Embaixador, Cabeleireiro, Consumidor)
      const { data: profile } = await supabase
        .from('profiles')
        .select('tipo_usuario, xp')
        .eq('id', user.id)
        .single()

      let valorBase = 100 // XP base por cada 15 minutos
      let multiplicador = 0.2 // Padrão Consumidor (20%)

      if (profile?.tipo_usuario === 'embaixador') multiplicador = 0.5
      if (profile?.tipo_usuario === 'cabeleireiro') multiplicador = 0.3

      const totalAdicionar = Math.floor(valorBase * multiplicador)

      // Atualiza o banco de dados
      await supabase
        .from('profiles')
        .update({ xp: (profile?.xp || 0) + totalAdicionar })
        .eq('id', user.id)

      // Dispara o Pop-up visual
      setXpGanho(totalAdicionar)
      setShowXPModal(true)
    } catch (error) {
      console.error("Erro ao processar XP da academia:", error)
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      
      {/* Botão de Voltar Personalizado */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold group"
      >
        <div className="p-2 bg-white rounded-full border shadow-sm group-hover:shadow-md transition-shadow">
          <ArrowLeft size={20} />
        </div>
        Voltar para Academy
      </button>

      {/* Container do Vídeo */}
      <div className="bg-black rounded-[40px] overflow-hidden shadow-2xl aspect-video relative border-4 border-white">
        {course?.videoUrl ? (
          <iframe 
            src={course.videoUrl} 
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white gap-4">
            <PlayCircle size={64} className="text-slate-700" />
            <p className="font-bold text-slate-500">Vídeo não disponível</p>
          </div>
        )}
      </div>

      {/* Informações e Progresso de XP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {course?.title || "Aula sem título"}
          </h1>
          <div className="h-1 w-20 bg-blue-600 rounded-full" />
          <p className="text-slate-500 text-lg leading-relaxed">
            {course?.description || "Nenhuma descrição fornecida para esta aula."}
          </p>
        </div>

        {/* Card do Cronômetro Masc PRO */}
        <div className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 text-blue-400">
              <Clock size={24} />
              <span className="font-black text-xs uppercase tracking-[0.2em]">Bônus de Atividade</span>
            </div>
            
            <div className="text-4xl font-black mb-2 font-mono">
              {Math.floor((900 - secondsActive) / 60)}:
              {String((900 - secondsActive) % 60).padStart(2, '0')}
            </div>
            
            <p className="text-slate-400 text-xs font-bold mb-6 uppercase italic">
              Para o próximo XP
            </p>

            {/* Barra de progresso circular sutil ou linear */}
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-[2px]">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                style={{ width: `${(secondsActive / 900) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up de Conquista */}
      <XPModal 
        amount={xpGanho} 
        visible={showXPModal} 
        onClose={() => setShowXPModal(false)} 
      />
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Play, Clock, Award, Loader2 } from "lucide-react"
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

  // 1. Buscar dados do curso
  useEffect(() => {
    const fetchCourse = async () => {
      const { data } = await supabase
        .from('Course') // Verifique se sua tabela é 'Course' ou 'course'
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) setCourse(data)
      setLoading(false)
    }
    fetchCourse()
  }, [id])

  // 2. Temporizador de Atividade (XP a cada 15 min / 900 seg)
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

  const adicionarXPAtividade = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Busca o perfil para ver o tipo_usuario (Embaixador, Cabeleireiro ou Consumidor)
    const { data: profile } = await supabase
      .from('profiles') // Lembre-se de ajustar para o nome real da sua tabela de perfis
      .select('tipo_usuario, xp')
      .eq('id', user.id)
      .single()

    let valorBase = 100 // XP base para 15 minutos
    let multiplicador = 0.2 // Padrão Consumidor (20%)

    if (profile?.tipo_usuario === 'embaixador') multiplicador = 0.5
    if (profile?.tipo_usuario === 'cabeleireiro') multiplicador = 0.3

    const totalAdicionar = Math.floor(valorBase * multiplicador)

    await supabase
      .from('profiles')
      .update({ xp: (profile?.xp || 0) + totalAdicionar })
      .eq('id', user.id)

    setXpGanho(totalAdicionar)
    setShowXPModal(true)
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      
      {/* CABEÇALHO */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold group"
      >
        <div className="p-2 bg-white rounded-full border shadow-sm group-hover:bg-slate-50">
          <ArrowLeft size={20} />
        </div>
        Voltar para Academy
      </button>

      {/* PLAYER DE VÍDEO (ESTILO NETFLIX) */}
      <div className="bg-black rounded-[32px] overflow-hidden shadow-2xl aspect-video relative group">
        <iframe 
          src={course?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
          className="w-full h-full"
          allowFullScreen
        ></iframe>
      </div>

      {/* INFORMAÇÕES DA AULA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-black text-slate-900">{course?.title}</h1>
          <p className="text-slate-500 leading-relaxed">{course?.description}</p>
        </div>

        {/* STATUS DE XP (VISUAL) */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Clock size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">Próximo XP em:</span>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-2">
            {Math.floor((900 - secondsActive) / 60)}m { (900 - secondsActive) % 60}s
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000" 
              style={{ width: `${(secondsActive / 900) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 leading-tight uppercase font-bold tracking-tighter">
            Continue assistindo para ganhar XP proporcional ao seu cargo Masc PRO.
          </p>
        </div>
      </div>

      {/* MODAL DE XP */}
      <XPModal 
        amount={xpGanho} 
        visible={showXPModal} 
        onClose={() => setShowXPModal(false)} 
      />
    </div>
  )
}
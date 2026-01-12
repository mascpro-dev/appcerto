"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  ArrowLeft, 
  LayoutDashboard, 
  ShoppingBag, 
  GraduationCap, 
  Users, 
  Settings,
  LogOut,
  Loader2
} from "lucide-react"
import XPBar from "@/components/xp-bar"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  // 1. Verificação de Sessão (Proteção)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUserName(session.user.email?.split('@')[0] || "Membro")
        setAuthorized(true)
      }
      setLoading(false)
    }
    checkSession()
  }, [router, supabase])

  const [authorized, setAuthorized] = useState(false)

  // Função para Sair (Apenas quando clicar no botão de Sair)
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* CABEÇALHO / NAVBAR SUPERIOR */}
        <div className="flex items-center justify-between mb-8">
          {/* BOTÃO VOLTAR CORRIGIDO: router.back() garante que não deslogue */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold group"
          >
            <div className="p-2 bg-white rounded-full border shadow-sm group-hover:shadow-md transition-shadow">
              <ArrowLeft size={20} />
            </div>
            <span>Voltar</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-full transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        {/* BOAS VINDAS */}
        <div className="space-y-1">
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Bem-vindo de volta,</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic">Olá, {userName}!</h1>
        </div>

        {/* COMPONENTE DE XP (BARRA DO EMBAIXADOR) */}
        <XPBar />

        {/* MENU DE NAVEGAÇÃO RÁPIDA (CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          
          {/* CARD LOJA */}
          <button 
            onClick={() => router.push('/loja')}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">LOJA MASC PRO</h3>
              <p className="text-slate-500 text-sm font-medium">Compre produtos e acumule XP.</p>
            </div>
          </button>

          {/* CARD ACADEMY */}
          <button 
            onClick={() => router.push('/academy')}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
              <GraduationCap size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">ACADEMY</h3>
              <p className="text-slate-500 text-sm font-medium">Assista aulas e suba de nível.</p>
            </div>
          </button>

          {/* CARD COMUNIDADE/RANKING */}
          <button 
            onClick={() => router.push('/ranking')}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">RANKING</h3>
              <p className="text-slate-500 text-sm font-medium">Veja quem são os líderes PRO.</p>
            </div>
          </button>

        </div>

      </div>
    </div>
  )
}
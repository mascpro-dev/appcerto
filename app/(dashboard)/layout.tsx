"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  ArrowLeft, 
  ShoppingBag, 
  GraduationCap, 
  Users, 
  LogOut,
  Loader2,
  Sparkles,
  X
} from "lucide-react"
import XPBar from "@/components/xp-bar"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [perfil, setPerfil] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setPerfil(data)
        setUserName(user.email?.split('@')[0] || "Membro")
        
        // Lógica: Se for embaixador e nunca viu o welcome, mostra
        if (data?.tipo_usuario === 'embaixador') {
           setShowWelcome(true)
        }
      }
      setLoading(false)
    }
    checkSession()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative">
      
      {/* MODAL DE BOAS-VINDAS ELITE */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden border-4 border-amber-400">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setShowWelcome(false)} className="text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 shadow-inner">
                <Sparkles size={40} className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 italic leading-none uppercase">Acesso Liberado!</h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Seja bem-vindo, {userName}</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
                <p className="text-slate-700 text-sm leading-relaxed">
                  Você foi reconhecido como <span className="text-blue-600 font-black italic underline">EMBAIXADOR CERTIFICADO</span>. 
                  Sua jornada na Masc PRO começa com <span className="font-bold text-slate-900 text-lg">50% de bônus</span> em todo XP acumulado!
                </p>
              </div>

              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase italic tracking-tighter hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP NAV */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <LayoutDashboard size={20} />
             </div>
             <span className="font-black italic text-slate-900 uppercase text-lg tracking-tighter">Masc PRO Dashboard</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        {/* BOAS VINDAS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Ecossistema de Elite</p>
            <h1 className="text-5xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">Olá, {userName}!</h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
             <span className="text-slate-400 text-[10px] font-black uppercase block mb-1">Status da Conta</span>
             <span className="text-blue-600 font-black italic text-sm uppercase">
                {perfil?.tipo_usuario === 'embaixador' ? '💎 Embaixador Certificado' : '❤️ MASC Lover'}
             </span>
          </div>
        </div>

        {/* BARRA DE XP */}
        <XPBar />

        {/* CARDS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          <button onClick={() => router.push('/loja')} className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all text-left border border-slate-50 group">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Loja</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium leading-tight">Adquira produtos e turbine seu pontuário.</p>
          </button>

          <button onClick={() => router.push('/academy')} className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all text-left border border-slate-50 group">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-slate-200">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Academy</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium leading-tight">Assista aulas técnicas e suba sua patente.</p>
          </button>

          <button onClick={() => router.push('/ranking')} className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all text-left border border-slate-50 group">
            <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-100">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Ranking</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium leading-tight">Acompanhe a elite dos profissionais PRO.</p>
          </button>

        </div>

      </div>
    </div>
  )
}
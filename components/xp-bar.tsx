"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  X, Menu, GraduationCap, Calendar, ShoppingBag, 
  LogOut, Trophy, Zap, Award, CheckCircle2, Heart, ShieldCheck, Crown
} from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [perfil, setPerfil] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  // 1. Carregar os dados do perfil para saber o XP e a Patente
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setPerfil(data)
      }
    }
    fetchUser()
  }, [supabase])

  // 2. Lógica de Patente (a mesma que usamos na XP Bar)
  const getPatente = (xp: number, tipo: string) => {
    const ehEmbaixadorNoInicio = tipo === 'embaixador' && xp < 30000;
    if (xp >= 200000) return { nome: "EDUCADOR", cor: "text-amber-400" };
    if (xp >= 100000) return { nome: "MASTER", cor: "text-purple-400" };
    if (xp >= 50000) return { nome: "EXPERT", cor: "text-red-500" };
    if (ehEmbaixadorNoInicio || xp >= 10000) return { nome: "CERTIFICADO", cor: "text-blue-400" };
    return { nome: "MASC LOVER", cor: "text-pink-400" };
  }

  const patente = getPatente(perfil?.xp || 0, perfil?.tipo_usuario)

  return (
    <>
      {/* Botão Hambúrguer para Telemóvel */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-[90] p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Menu Lateral */}
      <div className={`fixed inset-y-0 left-0 z-[100] w-72 bg-[#0a0f1c] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}>
        
        <div className="flex flex-col h-full">
          {/* Header do Menu */}
          <div className="p-8 flex items-center justify-between">
            <h2 className="text-white font-black italic text-2xl uppercase tracking-tighter">
              MASC<span className="text-blue-500">PRO</span>
            </h2>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          {/* PERFIL DO USUÁRIO NA LATERAL (Onde o nível aparece) */}
          <div className="px-8 py-6 border-b border-white/5 bg-white/5 mb-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Status Atual</p>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full bg-current ${patente.cor} animate-pulse`} />
              <span className={`font-black italic uppercase text-sm ${patente.cor}`}>
                {patente.nome}
              </span>
            </div>
            <p className="text-white/40 text-[9px] mt-1 font-bold">
              {perfil?.email?.split('@')[0]}
            </p>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 px-4 space-y-2">
            {[
              { name: "Academy", path: "/academy", icon: <GraduationCap size={18} /> },
              { name: "Loja", path: "/loja", icon: <ShoppingBag size={18} /> },
              { name: "Ranking", path: "/ranking", icon: <Trophy size={18} /> },
              { name: "Minha Agenda", path: "/agenda", icon: <Calendar size={18} /> },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => { router.push(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  pathname === item.path ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Sair da Conta */}
          <div className="p-6">
            <button 
              onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
              className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 font-bold transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm italic uppercase">Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay para fechar no telemóvel */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] lg:hidden"
        />
      )}
    </>
  )
}
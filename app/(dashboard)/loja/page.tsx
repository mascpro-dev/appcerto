"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Loader2, Package } from "lucide-react"
import XPBar from "@/components/xp-bar"

export default function LojaPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Trava de Segurança: Só entra se estiver logado (Corrigido para getUser)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login') 
        } else {
          setAuthorized(true)
        }
      } catch (error) {
        console.error("Erro na autenticação:", error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 space-y-6">
      
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* CABEÇALHO COM BOTÃO VOLTAR SEGURO */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold group"
          >
            <div className="p-2 bg-white rounded-full border shadow-sm group-hover:shadow-md transition-shadow">
              <ArrowLeft size={20} />
            </div>
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
            <ShoppingBag size={18} className="text-blue-600" />
            <span className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em]">Masc PRO Shop</span>
          </div>
        </div>

        {/* BARRA DE XP - IMPORTANTE PARA O EMBAIXADOR VER O STATUS NA LOJA */}
        <XPBar />

        {/* ÁREA DE PRODUTOS */}
        <div className="pt-6">
           <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 italic uppercase leading-none">Vitrine PRO</h1>
              <div className="h-1.5 w-24 bg-blue-600 mt-3 rounded-full"></div>
           </div>
           
           {/* GRID DE PRODUTOS (Placeholder enquanto conecta Nuvemshop) */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-white p-10 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-4 group hover:border-blue-400 transition-colors">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                    <Package size={40} />
                 </div>
                 <div>
                    <p className="text-slate-900 font-black uppercase text-sm">Sincronizando Loja...</p>
                    <p className="text-slate-400 text-xs font-medium mt-1">Seus produtos da Nuvemshop aparecerão aqui em instantes.</p>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  )
}
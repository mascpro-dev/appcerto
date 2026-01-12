"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react"
import XPBar from "@/components/xp-bar"

export default function LojaPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  // 1. Trava de Segurança: Só entra se estiver logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login') 
      } else {
        setAuthorized(true)
      }
    }
    checkUser()
  }, [supabase, router])

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      
      {/* CABEÇALHO DA LOJA */}
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()} // VOLTAR SEGURO: Não desloga
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold group"
          >
            <div className="p-2 bg-white rounded-full border shadow-sm group-hover:shadow-md">
              <ArrowLeft size={20} />
            </div>
            Voltar
          </button>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm">
            <ShoppingBag size={18} className="text-blue-600" />
            <span className="font-black text-slate-800 uppercase text-xs tracking-widest">Loja Masc PRO</span>
          </div>
        </div>

        {/* BARRA DE XP NO TOPO DA LOJA */}
        <XPBar />

        {/* LISTA DE PRODUTOS */}
        <div className="mt-8">
           <h1 className="text-3xl font-black text-slate-900 mb-2 italic">PRODUTOS EXCLUSIVOS</h1>
           <p className="text-slate-500 font-medium mb-8">Compre e acumule XP conforme seu cargo.</p>
           
           {/* ONDE OS PRODUTOS DA NUVEMSHOP SERÃO LISTADOS */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seus componentes de produto entram aqui */}
              <div className="bg-white p-8 rounded-[40px] border border-dashed border-slate-300 text-center">
                 <p className="text-slate-400 font-bold uppercase text-xs">Sincronizando com Nuvemshop...</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
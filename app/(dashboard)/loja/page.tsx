"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { 
  ShoppingBag, Loader2, Package, Search, Filter, Zap, ArrowRight, CheckCircle 
} from "lucide-react"
import XPBar from "@/components/xp-bar"
import { toast, Toaster } from "react-hot-toast"

export default function LojaPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [perfil, setPerfil] = useState<any>(null)
  const [comprando, setComprando] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setPerfil(data)
      setLoading(false)
    }
    fetchData()
  }, [supabase, router])

  // FUNÇÃO MÁGICA: ADICIONAR XP AO COMPRAR
  const handleCompra = async (produtoNome: string, xpGanho: number) => {
    setComprando(produtoNome)
    
    try {
      const novoXP = (perfil?.xp || 0) + xpGanho
      
      const { error } = await supabase
        .from('profiles')
        .update({ xp: novoXP })
        .eq('id', perfil.id)

      if (error) throw error

      // Atualiza o estado local para a UI reagir na hora
      setPerfil({ ...perfil, xp: novoXP })
      
      toast.success(`Compra realizada! +${xpGanho} XP adicionados!`, {
        icon: '🚀',
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: 'bold' }
      })

    } catch (error) {
      toast.error("Erro ao processar compra.")
    } finally {
      setComprando(null)
    }
  }

  const produtos = [
    { id: '1', nome: "Kit Progressiva Masc PRO", preco: "189,90", xp: 500, tag: "Mais Vendido" },
    { id: '2', nome: "Sérum Finalizador Platinum", preco: "89,00", xp: 250, tag: "Destaque" },
    { id: '3', nome: "Máscara de Reconstrução", preco: "120,00", xp: 350, tag: "Novo" },
    { id: '4', nome: "Curso Técnicas de Corte", preco: "497,00", xp: 2000, tag: "Academy" },
  ]

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 space-y-8">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <Zap size={14} className="fill-blue-600" /> Mercado Masc PRO
            </div>
            <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
              Shop <span className="text-slate-300">Exclusivo</span>
            </h1>
          </div>
        </div>

        {/* BARRA DE XP DINÂMICA */}
        <XPBar />

        {/* VITRINE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((p) => (
            <div key={p.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                <Package size={48} className="text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
                  +{p.xp} XP
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{p.tag}</p>
                  <h4 className="text-lg font-black text-slate-900 leading-tight uppercase italic">{p.nome}</h4>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 italic">R$ {p.preco}</span>
                  <button 
                    onClick={() => handleCompra(p.nome, p.xp)}
                    disabled={comprando === p.nome}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90 disabled:opacity-50"
                  >
                    {comprando === p.nome ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
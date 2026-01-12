"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ShoppingBag, Loader2, Package, AlertCircle } from "lucide-react"
import XPBar from "@/components/xp-bar"
import { toast } from "react-hot-toast"

export default function LojaPage() {
  const supabase = createClientComponentClient()
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [perfil, setPerfil] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // 1. Pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Carrega o perfil do usuário
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setPerfil(profileData)

        // 2. CORREÇÃO DO ERRO 406: Carrega produtos sem filtros 'undefined'
        // Busca todos os produtos ativos
        const { data: productsData, error: prodError } = await supabase
          .from('Product') // Certifique-se que o nome da tabela é 'Product' com P maiúsculo como no erro
          .select('*')
          .order('name', { ascending: true })

        if (prodError) {
          console.error("Erro ao carregar produtos:", prodError)
          toast.error("Erro ao carregar vitrine.")
        } else {
          setProdutos(productsData || [])
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const handleCompra = async (produto: any) => {
    if (!perfil) return;
    
    try {
      const novoXP = (perfil.xp || 0) + (produto.xp_value || 500)
      const { error } = await supabase
        .from('profiles')
        .update({ xp: novoXP })
        .eq('id', perfil.id)

      if (error) throw error
      
      setPerfil({ ...perfil, xp: novoXP })
      toast.success(`${produto.name} adquirido! XP atualizado.`)
    } catch (e) {
      toast.error("Erro ao processar XP.")
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="p-4 md:p-10 space-y-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">Shop Masc PRO</h1>
      <XPBar />

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-dashed border-slate-200">
          <Package size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-500 font-bold uppercase text-xs italic">Nenhum produto cadastrado no banco</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {produtos.map((prod) => (
            <div key={prod.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
                <Package size={40} className="text-slate-200" />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full italic">
                  +{prod.xp_value || 500} XP
                </div>
              </div>
              <p className="font-black text-slate-900 uppercase italic text-lg">{prod.name}</p>
              <div className="flex justify-between items-center mt-6">
                <span className="font-black text-2xl text-slate-900 italic">R$ {prod.price}</span>
                <button 
                  onClick={() => handleCompra(prod)}
                  className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, ShoppingCart, Zap, Package, Loader2 } from "lucide-react"

export default function DetalheProdutoPage() {
  const router = useRouter()
  const params = useParams() // Captura o [slug] da URL
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. Altere para o seu domínio real da Nuvemshop
  const URL_LOJA_NUVEM = "https://mascpro.com.br" 

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        // Buscamos a lista de produtos da nossa API interna
        const response = await fetch('/api/products')
        const data = await response.json()
        
        // Procuramos o produto que tenha o "slug" igual ao da URL
        const found = data.find((p: any) => p.slug === params.slug)
        
        setProduto(found)
      } catch (err) {
        console.error("Erro ao carregar produto:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      loadProduct()
    }
  }, [params.slug])

  const handleComprar = () => {
    if (!produto) return
    // Redireciona para o carrinho da Nuvemshop usando o ID real do produto
    window.open(`${URL_LOJA_NUVEM}/cart/add/${produto.id}`, '_blank')
  }

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  if (!produto) return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold">Produto não encontrado 😕</h2>
      <button onClick={() => router.push('/loja')} className="text-blue-600 mt-4 underline">
        Voltar para a Loja
      </button>
    </div>
  )

  const temEstoque = produto.stock > 0

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold group"
      >
        <div className="p-2 bg-white rounded-full border shadow-sm group-hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} />
        </div>
        Voltar para a Loja
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* IMAGEM DO PRODUTO */}
        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex items-center justify-center relative overflow-hidden">
          <img 
            src={produto.image_url} 
            className="w-full h-auto max-h-[400px] object-contain hover:scale-105 transition duration-700"
            alt={produto.title}
          />
          {!temEstoque && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-black uppercase tracking-tighter">Esgotado</span>
            </div>
          )}
        </div>

        {/* INFORMAÇÕES E COMPRA */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
            <Zap size={12} className="fill-blue-600" />
            Ganhe +{Math.floor(produto.price / 2)} XP nesta compra
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight">
            {produto.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-black text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)}
            </span>
            <div className="flex items-center gap-1 text-slate-400 text-sm font-bold border-l pl-4">
              <Package size={16} />
              {temEstoque ? `${produto.stock} em estoque` : "Sem estoque"}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Descrição</h3>
            <div className="text-slate-600 leading-relaxed text-sm">
               {/* Renderiza o HTML que vem da Nuvemshop */}
               <div dangerouslySetInnerHTML={{ __html: produto.description }} />
            </div>
          </div>

          <button 
            onClick={handleComprar}
            disabled={!temEstoque}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl
              ${temEstoque 
                ? "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-100" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"}
            `}
          >
            <ShoppingCart size={24} />
            {temEstoque ? "COMPRAR AGORA" : "PRODUTO INDISPONÍVEL"}
          </button>
        </div>
      </div>
    </div>
  )
}
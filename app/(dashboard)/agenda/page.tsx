"use client"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"
import { Trash2, Calendar, Clock } from "lucide-react" // Ícones para a lista
import XPBar from "@/components/xp-bar"

export default function AgendaPage() {
  const supabase = createClientComponentClient()
  const [nome, setNome] = useState("")
  const [data, setData] = useState("")
  // Estado para armazenar a lista de agendamentos
  const [agendamentos, setAgendamentos] = useState<any[]>([])

  // 1. Função para carregar a lista (COM A CORREÇÃO DE SEGURANÇA)
  const carregarAgendamentos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    // TRAVA DE SEGURANÇA: Se não tem user, não busca nada (evita o erro 400/403)
    if (!user || !user.id) return 

    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('user_id', user.id) // Filtra pelo dono
      .order('data_hora', { ascending: true }) // Ordena por data

    if (error) {
      console.error("Erro ao listar:", error)
    } else {
      setAgendamentos(data || [])
    }
  }

  // Carrega a lista assim que a página abre
  useEffect(() => {
    carregarAgendamentos()
  }, [])

  // 2. Função de Agendar (A sua original, melhorada para atualizar a lista)
  const agendar = async () => {
    if (!nome || !data) return toast.error("Preencha todos os campos")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error("Faça login novamente.")

    const { error } = await supabase.from('agendamentos').insert([
      { cliente_nome: nome, data_hora: data, user_id: user.id }
    ])

    if (error) {
      console.error(error)
      toast.error("Erro ao salvar.")
    } else {
      toast.success("Agendado com sucesso!")
      setNome("")
      setData("")
      carregarAgendamentos() // Atualiza a lista na hora
    }
  }

  // Função extra para apagar (opcional, mas útil)
  const apagar = async (id: number) => {
    const { error } = await supabase.from('agendamentos').delete().eq('id', id)
    if (!error) {
        toast.success("Agendamento removido")
        carregarAgendamentos()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <XPBar />
      
      {/* FORMULÁRIO */}
      <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-100">
        <h2 className="text-2xl font-black uppercase italic mb-6 text-slate-800">Novo Agendamento</h2>
        <div className="space-y-4">
          <input 
            placeholder="Nome do Cliente" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200 focus:border-blue-500 outline-none" 
          />
          <input 
            type="datetime-local" 
            value={data} 
            onChange={e => setData(e.target.value)} 
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200 focus:border-blue-500 outline-none" 
          />
          <button 
            onClick={agendar} 
            className="w-full p-4 bg-slate-900 hover:bg-blue-600 transition-colors text-white font-black rounded-2xl uppercase tracking-widest"
          >
            Confirmar Agenda
          </button>
        </div>
      </div>

      {/* LISTAGEM (Onde estava o problema invisível) */}
      <div className="space-y-4">
        <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-4">Meus Agendamentos</h3>
        
        {agendamentos.length === 0 && (
            <p className="text-center text-slate-400 py-10 italic">Nenhum agendamento encontrado.</p>
        )}

        {agendamentos.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-300 transition-all">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase italic">{item.cliente_nome}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Clock size={12} />
                            {new Date(item.data_hora).toLocaleString('pt-BR')}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => apagar(item.id)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
      </div>
    </div>
  )
}
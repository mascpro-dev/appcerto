"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Loader2, MapPin, Calendar, Clock } from "lucide-react"

// --- COMPONENTE DO CARD DE EVENTO ---
const EventCard = ({ event }: { event: any }) => {
  // Formata a data para "12 de Agosto de 2024"
  const dateFormatted = new Date(event.date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Formata o preço
  const priceFormatted = event.price === 0 
    ? "Gratuito" 
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.price)

  return (
    <div className="group border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col h-full">
      {/* Imagem do Evento */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
        <img
          src={event.image_url || "https://placehold.co/800x400?text=Evento+MascPRO"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {/* Etiqueta de Preço flutuante */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-800 shadow-sm">
          {priceFormatted}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Data Destaque */}
        <div className="flex items-center text-blue-600 mb-2 text-sm font-medium">
          <Calendar size={16} className="mr-2" />
          {dateFormatted}
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
          {event.description}
        </p>

        {/* Localização */}
        <div className="flex items-center text-gray-400 text-xs mb-4">
          <MapPin size={14} className="mr-1" />
          {event.location || "Online"}
        </div>

        {/* Botão */}
        <button className="w-full mt-auto bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95">
          Garantir Vaga
        </button>
      </div>
    </div>
  )
}

// --- PÁGINA PRINCIPAL DA AGENDA ---
export default function AgendaPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // Busca eventos ordenados pela data (do mais próximo para o mais longe)
        const { data, error } = await supabase
          .from('Event')
          .select('*')
          .eq('isPublished', true)
          .order('date', { ascending: true })

        if (data) setEvents(data)
      } catch (error) {
        console.error("Erro ao buscar agenda:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Agenda & Eventos</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Fique por dentro dos workshops presenciais, cursos VIP e masterclasses exclusivas da Masc PRO.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum evento agendado</h3>
          <p className="text-gray-500 mt-1">Fique de olho, em breve teremos novidades!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Play, ArrowLeft, Loader2, GraduationCap, Star } from "lucide-react"

export default function AcademyPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Puxa Categorias
        const { data: catData } = await supabase.from('Category').select('*')
        // Puxa Cursos Publicados
        const { data: courseData } = await supabase
          .from('Course')
          .select(`*, Category (id, name)`)
          .eq('isPublished', true)

        if (catData) setCategories(catData)
        if (courseData) setCourses(courseData)
      } catch (error) {
        console.error("Erro ao carregar Academy:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      
      {/* BOTÃO VOLTAR E TÍTULO */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-white rounded-full transition-all border shadow-sm bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Masc PRO Academy</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Sua Especialização</p>
        </div>
      </div>

      {/* SEÇÃO ESTILO NETFLIX (POR CATEGORIA) */}
      {categories.map((category) => {
        const categoryCourses = courses.filter(c => c.categoryId === category.id)
        
        if (categoryCourses.length === 0) return null

        return (
          <div key={category.id} className="mb-12">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 px-1">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              {category.name}
            </h2>

            {/* CARROSSEL HORIZONTAL NETFLIX */}
            <div className="flex overflow-x-auto gap-6 pb-6 -mx-4 px-4 no-scrollbar snap-x">
              {categoryCourses.map((curso) => (
                <div 
                  key={curso.id} 
                  onClick={() => router.push(`/courses/${curso.id}`)}
                  className="min-w-[280px] md:min-w-[360px] snap-start group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={curso.imageUrl || "https://placehold.co/600x400/1e293b/FFF?text=Curso"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-full shadow-2xl translate-y-4 group-hover:translate-y-0 transition duration-500">
                        <Play className="text-slate-900 fill-slate-900 h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{curso.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                       <span className="bg-slate-100 px-2 py-1 rounded font-medium text-slate-600">
                         {category.name}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Caso não tenha nada no banco */}
      {courses.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum curso encontrado</h3>
          <p className="text-gray-500">Em breve novos conteúdos exclusivos.</p>
        </div>
      )}
    </div>
  )
}
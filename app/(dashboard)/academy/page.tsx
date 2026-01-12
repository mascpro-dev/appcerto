"use client"

import { useState } from "react"
import { Play, CheckCircle, Zap, GraduationCap } from "lucide-react"
import XPBar from "@/components/xp-bar"

export default function AcademyPage() {
  // Sua playlist oficial integrada
  const [videoAtivo] = useState("https://www.youtube.com/embed/videoseries?list=PLCob8Pdak9tArbNGl3ZATDiHF2gvaS34G")

  return (
    <div className="p-4 md:p-10 space-y-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-3">
          <GraduationCap size={40} className="text-blue-600" /> Masc Academy
        </h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Treinamento de Elite para Embaixadores</p>
      </div>

      <XPBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PLAYER PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-900">
            <iframe 
              width="100%" 
              height="100%" 
              src={videoAtivo} 
              title="Masc PRO Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <h2 className="text-2xl font-black italic uppercase text-slate-900">Playlist Oficial Masc PRO</h2>
             <p className="text-slate-500 mt-2 font-medium">Assista aos conteúdos técnicos para validar sua certificação e acumular pontos de experiência.</p>
          </div>
        </div>

        {/* LISTA DE MÓDULOS */}
        <div className="space-y-4">
          <h3 className="font-black uppercase italic text-slate-400 text-xs tracking-widest">Conteúdos Disponíveis</h3>
          
          {[
            { id: 1, titulo: "Introdução Masc PRO", status: "Concluído", xp: 100 },
            { id: 2, titulo: "Técnicas de Performance", status: "Disponível", xp: 500 },
            { id: 3, titulo: "Gestão de Carreira", status: "Disponível", xp: 800 },
          ].map((aula) => (
            <div key={aula.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${aula.status === 'Concluído' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {aula.status === 'Concluído' ? <CheckCircle size={20} /> : <Play size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 uppercase italic">{aula.titulo}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">+{aula.xp} XP • {aula.status}</p>
                </div>
              </div>
              <Zap size={16} className="text-slate-200 group-hover:text-blue-500" />
            </div>
          ))}

          <div className="p-6 bg-slate-900 rounded-[32px] text-center mt-6">
             <p className="text-white font-black italic uppercase text-xs">Novas aulas em breve</p>
          </div>
        </div>
      </div>
    </div>
  )
}
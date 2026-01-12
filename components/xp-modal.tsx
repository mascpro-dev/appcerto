"use client"
import { useState, useEffect } from "react"
import { Trophy, Star, Sparkles } from "lucide-react"
import confetti from "canvas-confetti" // Você pode instalar essa lib depois para ter fogos de artifício

export default function XPModal({ amount, visible, onClose }: any) {
  useEffect(() => {
    if (visible) {
      // Efeito de confete ao ganhar XP
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#60a5fa', '#ffffff']
      })
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
          <Trophy className="text-white w-12 h-12" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2">MUITO BEM!</h2>
        <p className="text-slate-500 font-bold mb-6">Você acaba de conquistar</p>
        
        <div className="bg-slate-50 border-2 border-blue-100 rounded-3xl py-4 px-8 mb-8 inline-flex items-center gap-3">
          <Star className="text-blue-600 fill-blue-600" size={24} />
          <span className="text-4xl font-black text-blue-600">+{amount} XP</span>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  )
}
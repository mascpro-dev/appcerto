"use client";

import { useState } from "react";
import { Trophy, MessageSquare, Share2, Heart, Award, Instagram, MapPin, Send } from "lucide-react";

const TOP_3 = [
  { id: 1, name: "Ricardo Silva", cidade: "São Paulo/SP", pro: "2.450", insta: "@ricardo_hair" },
  { id: 2, name: "Ana Beatriz", cidade: "Curitiba/PR", pro: "2.100", insta: "@ana_style" },
  { id: 3, name: "Marcos Paulo", cidade: "Rio de Janeiro/RJ", pro: "1.980", insta: "@marcos_pro" },
];

const TOP_7 = [
  { rank: 4, name: "Julia Lins", cidade: "BH", pro: "1.850" },
  { rank: 5, name: "Bruno Costa", cidade: "POA", pro: "1.720" },
  { rank: 6, name: "Carla Dias", cidade: "REC", pro: "1.600" },
  { rank: 7, name: "Vitor Hugo", cidade: "SSA", pro: "1.550" },
  { rank: 8, name: "Sonia Abrão", cidade: "FLN", pro: "1.400" },
  { rank: 9, name: "Pedro Vale", cidade: "BSB", pro: "1.320" },
  { rank: 10, name: "Lana Rho", cidade: "MAO", pro: "1.200" },
];

export default function ComunidadePage() {
  const [post, setPost] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700 pb-24">
      
      {/* --- FEED ESTILO 'X' (LADO ESQUERDO / CENTRAL) --- */}
      <div className="flex-1 space-y-6">
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            Comunidade <span className="text-[#C9A66B]">Masc Pro</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Troca Real • Sem Julgamentos</p>
        </div>

        {/* INPUT DE POSTAGEM GUIADA */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 space-y-4">
          <textarea 
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Compartilhe uma evolução técnica ou dúvida com contexto..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-600 resize-none h-24"
          />
          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Participação > Aparência</span>
            <button className="bg-[#C9A66B] text-black px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:scale-105 transition-transform uppercase">
              <Send size={14} /> Postar
            </button>
          </div>
        </div>

        {/* LISTA DE POSTS (FEED) */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-4 transition-all hover:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full border border-[#C9A66B]/20" />
                <div>
                  <p className="text-sm font-black text-white italic">Membro Fundador #{i+124}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Há 2 horas • São Paulo/SP</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Hoje consegui aplicar a técnica de correção de cor que vimos no módulo de Evolução. O segredo foi o tempo de pausa. Alguém mais teve essa percepção?
              </p>
              <div className="flex items-center gap-6 pt-2 text-slate-600">
                <button className="flex items-center gap-2 text-xs hover:text-[#C9A66B] transition-colors font-bold uppercase tracking-tighter"><Heart size={16} /> 24</button>
                <button className="flex items-center gap-2 text-xs hover:text-[#C9A66B] transition-colors font-bold uppercase tracking-tighter"><MessageSquare size={16} /> 8</button>
                <button className="flex items-center gap-2 text-xs hover:text-[#C9A66B] transition-colors font-bold uppercase tracking-tighter"><Share2 size={16} /> Compartilhar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RANKING TOP 10 (LADO DIREITO) --- */}
      <div className="w-full lg:w-[350px] space-y-6">
        <div className="bg-[#0A0A0A] border border-[#C9A66B]/10 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Trophy className="text-[#C9A66B]" size={20} />
            <h2 className="text-sm font-black text-white italic uppercase tracking-widest">Top 10 Autoridade</h2>
          </div>

          {/* OS 3 PRIMEIROS (DESTAQUE) */}
          <div className="space-y-4">
            {TOP_3.map((user, idx) => (
              <div key={user.id} className={`p-4 rounded-2xl border ${idx === 0 ? 'bg-[#C9A66B] text-black border-none' : 'bg-white/5 border-white/5 text-white'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-black uppercase ${idx === 0 ? 'text-black/60' : 'text-[#C9A66B]'}`}>#{idx + 1} LUGAR</span>
                  <span className="text-[10px] font-black">{user.pro} PRO</span>
                </div>
                <p className="font-black italic uppercase tracking-tighter text-sm">{user.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[9px] font-bold flex items-center gap-1 opacity-70`}>
                    <MapPin size={10} /> {user.cidade}
                  </span>
                  <a href="#" className="text-[9px] font-black flex items-center gap-1 underline italic">
                    <Instagram size={10} /> {user.insta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* OUTROS 7 (LISTA MINIMALISTA) */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            {TOP_7.map((user) => (
              <div key={user.rank} className="flex items-center justify-between px-2 text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-black w-4">{user.rank}</span>
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-bold uppercase tracking-tight">{user.name}</span>
                    <span className="text-slate-600 text-[9px] font-bold uppercase tracking-tighter">{user.cidade}</span>
                  </div>
                </div>
                <span className="text-[#C9A66B] font-black opacity-50">{user.pro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MENSAGEM DE MATURIDADE */}
        <div className="p-4 bg-[#C9A66B]/5 border border-[#C9A66B]/10 rounded-2xl text-center">
            <p className="text-[9px] text-[#C9A66B] font-black uppercase tracking-widest">Não é ranking de ego. É prova de entrega.</p>
        </div>
      </div>

    </div>
  );
}
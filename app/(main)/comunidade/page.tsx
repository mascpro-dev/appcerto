export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Crown, Medal, Shield, TrendingUp, User } from "lucide-react";

export default async function ComunidadePage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("pro_balance", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            RANKING <span className="text-[#C9A66B]">ELITE</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Sua posição define sua autoridade.
          </p>
        </div>
      </div>

      {/* PODIUM (Top 3 - Estilo Outline) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
        
        {/* 2º Lugar (Prata) */}
        {profiles && profiles[1] && (
           <div className="order-2 md:order-1 relative p-6 rounded-2xl border border-slate-600 bg-transparent flex flex-col items-center text-center hover:border-slate-400 transition-colors group">
             <Medal className="text-slate-500 group-hover:text-slate-300 transition-colors mb-2" size={28} />
             <div className="w-16 h-16 rounded-full border-2 border-slate-600 p-1 mb-3">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-slate-500 font-bold">
                    {profiles[1].avatar_url ? <img src={profiles[1].avatar_url} className="w-full h-full object-cover" /> : profiles[1].full_name?.charAt(0)}
                </div>
             </div>
             <h3 className="text-slate-300 font-bold truncate w-full">{profiles[1].full_name}</h3>
             <div className="mt-2 text-slate-500 font-mono font-bold text-xs border border-slate-700 px-3 py-1 rounded-full">
                {profiles[1].pro_balance} PRO
             </div>
           </div>
        )}

        {/* 1º Lugar (Ouro) */}
        {profiles && profiles[0] && (
           <div className="order-1 md:order-2 relative p-8 rounded-2xl border border-[#C9A66B] bg-transparent flex flex-col items-center text-center shadow-[0_0_30px_rgba(201,166,107,0.1)] transform md:-translate-y-4">
             <Crown className="text-[#C9A66B] mb-2 animate-bounce" size={40} fill="currentColor" />
             <div className="w-24 h-24 rounded-full border-2 border-[#C9A66B] p-1 mb-3 shadow-[0_0_20px_rgba(201,166,107,0.2)]">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-[#C9A66B] font-black text-2xl">
                    {profiles[0].avatar_url ? <img src={profiles[0].avatar_url} className="w-full h-full object-cover" /> : profiles[0].full_name?.charAt(0)}
                </div>
             </div>
             <h3 className="text-white text-xl font-black truncate w-full">{profiles[0].full_name}</h3>
             <div className="mt-2 text-[#C9A66B] font-mono font-bold text-sm border border-[#C9A66B] px-4 py-1 rounded-full shadow-[0_0_10px_rgba(201,166,107,0.2)]">
                {profiles[0].pro_balance} PRO
             </div>
           </div>
        )}

        {/* 3º Lugar (Bronze) */}
        {profiles && profiles[2] && (
           <div className="order-3 relative p-6 rounded-2xl border border-amber-800 bg-transparent flex flex-col items-center text-center hover:border-amber-600 transition-colors group">
             <Medal className="text-amber-800 group-hover:text-amber-600 transition-colors mb-2" size={28} />
             <div className="w-16 h-16 rounded-full border-2 border-amber-800 p-1 mb-3">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-amber-800 font-bold">
                    {profiles[2].avatar_url ? <img src={profiles[2].avatar_url} className="w-full h-full object-cover" /> : profiles[2].full_name?.charAt(0)}
                </div>
             </div>
             <h3 className="text-slate-400 font-bold truncate w-full">{profiles[2].full_name}</h3>
             <div className="mt-2 text-amber-800 font-mono font-bold text-xs border border-amber-900 px-3 py-1 rounded-full">
                {profiles[2].pro_balance} PRO
             </div>
           </div>
        )}
      </div>

      {/* LISTA COMPLETA (Estilo Clean) */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-transparent">
        <div className="divide-y divide-white/5">
            {profiles?.slice(3).map((profile, index) => {
                const isMe = profile.id === currentUserId;
                return (
                    <div 
                        key={profile.id} 
                        className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${isMe ? 'bg-[#C9A66B]/5 border-l-2 border-[#C9A66B]' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-slate-600 font-mono font-bold w-6 text-center text-sm">
                                {index + 4}
                            </span>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase overflow-hidden border border-white/10 ${isMe ? 'text-[#C9A66B]' : 'text-slate-500'}`}>
                                {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : (profile.full_name?.charAt(0) || "U")}
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${isMe ? 'text-[#C9A66B]' : 'text-slate-300'}`}>
                                    {profile.full_name} {isMe && "(Você)"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`font-mono font-bold ${isMe ? 'text-[#C9A66B]' : 'text-slate-500'}`}>{profile.pro_balance}</span>
                            <span className="text-[10px] text-slate-600 font-bold">PRO</span>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
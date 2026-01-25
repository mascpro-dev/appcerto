"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MessageSquare, Heart, Share2, Send } from "lucide-react";

export default function ComunidadePage() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Carregar posts da comunidade
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });
      
      if (!error && data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("posts").insert([
      { content: postContent, user_id: session.user.id }
    ]);

    if (!error) {
      setPostContent("");
      // Atualizar lista de posts (recarregamento simples para o teste)
      window.location.reload();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-24">
      {/* Título e Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Comunidade <span className="text-[#C9A66B]">MASC</span>
        </h1>
        {/* CORREÇÃO DO SÍMBOLO QUE TRAVA O VERCEL */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Participação {" > "} Aparência
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Caixa de Criação de Post */}
          <form onSubmit={handlePostSubmit} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="O que está acontecendo no seu salão hoje?"
              className="w-full bg-transparent border-none text-white placeholder:text-slate-600 resize-none focus:outline-none min-h-[100px]"
            />
            <div className="flex justify-end border-t border-white/5 pt-4">
              <button 
                type="submit"
                className="bg-[#C9A66B] text-black font-black px-6 py-2 rounded-xl text-xs uppercase hover:opacity-90 flex items-center gap-2"
              >
                Postar <Send size={14} />
              </button>
            </div>
          </form>

          {/* Lista de Posts */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-500 text-sm italic">Carregando feed...</p>
            ) : posts.map((post) => (
              <div key={post.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A66B] to-amber-200 flex items-center justify-center text-black font-bold">
                      {post.profiles?.full_name?.charAt(0) || "M"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{post.profiles?.full_name || "Membro MASC"}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight">Profissional PRO</p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-[#C9A66B] transition-colors">
                    <Heart size={16} /> <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-[#C9A66B] transition-colors">
                    <MessageSquare size={16} /> <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-[#C9A66B] transition-colors ml-auto">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Lateral */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-black text-[#C9A66B] uppercase italic mb-4">Regras da Comunidade</h3>
            <ul className="text-xs text-slate-400 space-y-3">
              <li>• Respeito mútuo entre profissionais.</li>
              <li>• Compartilhe técnicas e resultados.</li>
              <li>• Ganhe 10 PRO por cada post relevante.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
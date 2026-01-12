"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelect() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function escolher(role: "PRO" | "CLI") {
    setLoading(true);
    document.cookie = `role=${role}; path=/; max-age=600`; // guarda 10 min
    router.push("/auth-choice");                            // próximo passo
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-12 p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold">Escolha sua opção</h1>

      <button
        onClick={() => escolher("PRO")}
        className="w-full bg-gray-100 rounded-2xl p-10 text-center shadow hover:shadow-md"
      >
        <div className="text-6xl text-brand mb-3">🏬</div>
        <div className="font-medium">Tenho um estabelecimento</div>
        <p className="text-sm text-gray-600">Quero cadastrar meu espaço</p>
      </button>

      <button
        onClick={() => escolher("CLI")}
        className="w-full bg-gray-100 rounded-2xl p-10 text-center shadow hover:shadow-md"
      >
        <div className="text-6xl text-brand mb-3">🧑</div>
        <div className="font-medium">Sou cliente</div>
        <p className="text-sm text-gray-600">Quero agendar um horário</p>
      </button>

      {loading && <small>Redirecionando…</small>}
    </main>
  );
}

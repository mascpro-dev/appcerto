"use client";

import Sidebar from "@/componentes/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", session.user.id)
            .single();

        if (profile && !profile.onboarding_completed && pathname !== "/onboarding") {
            router.push("/onboarding");
        } else {
            setChecking(false);
        }
      } else {
        setChecking(false);
      }
    }
    checkOnboarding();
  }, [supabase, router, pathname]);

  if (checking) return <div className="min-h-screen bg-black w-full" />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#C9A66B] selection:text-black">
      
      {/* SIDEBAR INTELIGENTE (Carrega Desktop ou Mobile) */}
      <Sidebar />

      {/* ÁREA DE CONTEÚDO */}
      {/* Ajustes de margem para não esconder conteúdo atrás das barras */}
      <main className="transition-all duration-300 w-full min-h-screen md:pl-64 pt-20 pb-28 md:pt-0 md:pb-0">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>

    </div>
  );
}
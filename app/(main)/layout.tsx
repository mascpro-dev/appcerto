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
        // Verifica se o onboarding foi feito
        const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", session.user.id)
            .single();

        // SE O PERFIL EXISTIR E NÃO TIVER FEITO ONBOARDING:
        if (profile && !profile.onboarding_completed && pathname !== "/onboarding") {
            router.push("/onboarding");
        } else {
            setChecking(false);
        }
      } else {
        // Sem sessão, deixa o middleware cuidar (ou a página de login)
        setChecking(false);
      }
    }
    checkOnboarding();
  }, [supabase, router, pathname]);

  // Enquanto verifica, tela preta para não piscar
  if (checking) return <div className="h-screen bg-black w-full" />;

  return (
    <div className="flex flex-row h-screen bg-black overflow-hidden relative">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        <div className="px-6 pt-24 pb-32 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
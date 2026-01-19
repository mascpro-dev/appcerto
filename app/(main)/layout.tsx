"use client";

import Sidebar from "@/componentes/Sidebar"; // <--- ESTA LINHA É FUNDAMENTAL
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

  if (checking) return <div className="h-screen bg-black w-full" />;

  return (
    <div className="flex flex-row h-screen bg-black overflow-hidden relative">
      
      {/* MENU UNIFICADO (PC + MOBILE) */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-black">
        {/* Padding calibrado para Mobile e Desktop */}
        <div className="px-6 pt-24 pb-32 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
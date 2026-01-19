"use client";

import Sidebar from "@/componentes/Sidebar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <main className="transition-all duration-300 w-full min-h-screen">
        {/* pt-24 garante o respiro para o "Olá, Membro Fundador" no mobile */}
        <div className="pt-24 pb-32 px-6 md:pt-12 md:pb-12 md:pl-[280px] max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
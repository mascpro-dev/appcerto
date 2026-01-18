import Sidebar from "@/componentes/Sidebar"; 
import MobileBottomNav from "@/componentes/MobileBottomNav"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* 1. Sidebar (O código dele diz: "Só apareço no PC") */}
      <Sidebar />

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12">
          {children}
        </div>
      </main>

      {/* 3. MobileNav (O código dele diz: "Só apareço no Celular") */}
      <MobileBottomNav />
      
    </div>
  );
}
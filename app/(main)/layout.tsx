import Sidebar from "@/componentes/Sidebar"; 
import MobileBottomNav from "@/componentes/MobileBottomNav"; // Importando o novo menu de baixo

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      
      {/* MENU PC (Esquerda) */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12"> 
          {/* Adicionei pb-24 no mobile pra barra de baixo não tapar o conteúdo */}
          {children}
        </div>
      </main>

      {/* MENU CELULAR (Embaixo) */}
      <MobileBottomNav />
      
    </div>
  );
}
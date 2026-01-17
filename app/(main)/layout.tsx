import Sidebar from "@/componentes/Sidebar"; 
import MobileBottomNav from "@/componentes/MobileBottomNav"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // "flex-row" garante que no PC fique um do lado do outro
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* Esquerda: Menu PC */}
      <Sidebar />

      {/* Direita: Conteúdo */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* pb-24 garante que o menu do celular não tampe o conteúdo */}
        <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12">
          {children}
        </div>
      </main>

      {/* Rodapé: Menu Celular (Fixo por cima de tudo) */}
      <MobileBottomNav />
      
    </div>
  );
}
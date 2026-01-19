import Sidebar from "@/componentes/Sidebar"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen bg-black overflow-hidden relative">
      
      {/* Menu Lateral */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        
        {/* AJUSTE FINO: Mudamos para pt-28 (112px) no mobile */}
        <div className="px-6 pt-28 pb-32 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
        
      </main>
      
    </div>
  );
}
// SÓ PODE TER ESSE IMPORT AQUI:
import Sidebar from "@/componentes/Sidebar"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* O Sidebar agora carrega tudo sozinho */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        <div className="p-6 pb-28 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
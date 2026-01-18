// ATENÇÃO: Apenas 1 import de componente aqui
import Sidebar from "@/componentes/Sidebar"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* O Sidebar carrega o menu certo dependendo do tamanho da tela */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {/* Padding para garantir que o menu do celular não tampe o texto */}
        <div className="p-6 pb-28 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
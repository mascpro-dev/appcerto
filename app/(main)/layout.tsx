import Sidebar from "@/componentes/Sidebar"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'flex' aqui faz o PC ficar lado a lado (Menu | Conteúdo)
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* Carrega o Sidebar (que se adapta sozinho pra PC ou Celular) */}
      <Sidebar />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {/* Espaçamento interno (padding) adaptado */}
        <div className="p-6 pb-28 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
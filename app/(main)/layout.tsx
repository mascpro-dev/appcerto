import Sidebar from "@/componentes/Sidebar"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen bg-black overflow-hidden relative">
      
      {/* Menu (Sidebar) */}
      <Sidebar />

      {/* Área de Conteúdo */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {/* AJUSTE FEITO AQUI: 
           Mudei de 'pt-24' para 'pt-28' no mobile.
           Isso empurra o texto "Olá..." para baixo, livrando ele do cabeçalho.
        */}
        <div className="px-6 pt-32 pb-32 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
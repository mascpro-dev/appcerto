// ... imports ...

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // ... lógica de verificação ...

  return (
    <div className="flex flex-row h-screen bg-black overflow-hidden relative">
      
      {/* AQUI CHAMA O SIDEBAR HÍBRIDO (PC + MOBILE) */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-black">
        {/* Padding calibrado para não ficar embaixo das barras no celular */}
        <div className="px-6 pt-24 pb-32 md:p-12 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
// ... imports continuam iguais ...

  // Mantenha a lógica do useEffect igual ...

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#C9A66B] selection:text-black">
      
      {/* O SIDEBAR (Carrega Desktop ou Mobile dependendo da tela) */}
      <Sidebar />

      {/* ÁREA DE CONTEÚDO */}
      {/* md:pl-64 -> Empurra o conteúdo para a direita no PC */}
      {/* pt-20 pb-24 -> Empurra o conteúdo para baixo/cima no Celular */}
      <main className="transition-all duration-300 w-full min-h-screen md:pl-64 pt-20 pb-28 md:pt-0 md:pb-0">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>

    </div>
  );
}
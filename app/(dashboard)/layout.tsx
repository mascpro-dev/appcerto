"use client" // Adicione isso na primeira linha se não tiver

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, ShoppingBag, Calendar, GraduationCap, LogOut } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Lista de Links do Menu
  const navItems = [
    { href: "/", label: "Meu Nível", icon: LayoutDashboard },
    { href: "/academy", label: "Academy", icon: GraduationCap },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/loja", label: "Loja", icon: ShoppingBag },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* 1. MENU MOBILE (Só aparece no celular) */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-lg">Masc PRO</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 2. MENU LATERAL (Sidebar - Fixo no PC, Gaveta no Celular) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8 md:block hidden">
            <h1 className="text-2xl font-bold text-slate-900">Masc PRO</h1>
            <p className="text-xs text-gray-500">App Educacional</p>
          </div>

          <nav className="space-y-2 flex-grow">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)} // Fecha menu ao clicar (mobile)
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                    }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <button 
            onClick={handleSignOut} 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mt-auto"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-0 md:p-0 overflow-x-hidden">
        {/* Camada escura quando menu mobile abre */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {children}
      </main>
    </div>
  )
}
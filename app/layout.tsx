import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Masc PRO - Academy & Shop',
  description: 'Sistema de Elite para Embaixadores Masc PRO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* O Toaster aqui garante que as mensagens apareçam por cima de tudo no celular */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // Estilo padrão para combinar com a Masc PRO
            duration: 5000,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
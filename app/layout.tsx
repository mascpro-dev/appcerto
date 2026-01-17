import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// 1. Importar o Analytics
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MASC PRO',
  description: 'Plataforma de Ensino Profissional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        {/* 2. Ativar o componente aqui no final */}
        <Analytics />
      </body>
    </html>
  )
}
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // CORREÇÃO: Usando getUser() que é o método suportado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Se o usuário NÃO está logado e tenta acessar as páginas internas
  if (!user && !req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Se o usuário JÁ ESTÁ logado e tenta ir para a página de login
  if (user && req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/' // Manda para a dashboard
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configuração de quais páginas o middleware deve atuar
export const config = {
  matcher: [
    /*
     * Protege todas as rotas, exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, logo.png, etc (arquivos públicos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)',
  ],
}
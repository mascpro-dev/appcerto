import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 🛡️ Forma ultra-compatível de pegar a sessão
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = req.nextUrl.pathname === '/login'

  // 1. Se NÃO está logado e tenta entrar no App -> Manda para o Login
  if (!session && !isLoginPage) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Se JÁ está logado e tenta entrar no Login -> Manda para a Home
  if (session && isLoginPage) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Vigia todas as rotas exceto:
     * - api (rotas de dados)
     * - _next/static (arquivos do sistema)
     * - _next/image (imagens otimizadas)
     * - favicon.ico e imagens públicas (png, jpg, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}
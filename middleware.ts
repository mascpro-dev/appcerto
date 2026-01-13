import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Usamos 'any' aqui para ignorar o erro de tipagem que está travando o seu Build na Vercel
  const { data: { session } } = await (supabase.auth as any).getSession()

  const isLoginPage = req.nextUrl.pathname === '/login'

  // 🛡️ Se não tiver sessão e não for a página de login, manda para o login
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 🛡️ Se já estiver logado e tentar ir para o login, manda para a home
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 1. Se NÃO estiver logado e tentar acessar área interna -> Manda para Login
  if (!session && req.nextUrl.pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // 2. Se NÃO estiver logado e tentar acessar a raiz -> Manda para Login
  if (!session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3. Se JÁ estiver logado e tentar acessar Login ou Raiz -> Manda para Home
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/login', '/home/:path*'],
}
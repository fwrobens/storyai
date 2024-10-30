import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(request.nextUrl.pathname)
  const token = request.cookies.get('auth-token')

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
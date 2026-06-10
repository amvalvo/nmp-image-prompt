import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Allow login page and auth API routes through
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // Check for session cookie
  const session = request.cookies.get('nmp_session')
  if (!session?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString())
    if (data.exp < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

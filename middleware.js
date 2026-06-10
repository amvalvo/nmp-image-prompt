export { default } from 'next-auth/middleware'

export const config = {
  // Protect everything except login and auth API routes
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)'],
}

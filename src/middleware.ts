import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const path = req.nextUrl.pathname

    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (
      (path.startsWith('/dashboard') ||
        path.startsWith('/treinos') ||
        path.startsWith('/agenda') ||
        path.startsWith('/perfil')) &&
      !token?.isPaid &&
      token?.role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/?paywall=1', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/treinos/:path*',
    '/agenda/:path*',
    '/perfil/:path*',
    '/admin/:path*',
  ],
}

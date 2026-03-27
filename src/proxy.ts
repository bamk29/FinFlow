import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Hanya ambil path yang diakses
  const path = request.nextUrl.pathname

  // Kecualikan path API Telegram (Webhook) agar bot telegram tidak terhalang
  if (path.startsWith('/api/telegram')) {
    return NextResponse.next()
  }

  // Cek otentikasi
  const session = request.cookies.get('finflow_session')?.value
  const isPublicRoute = path === '/login'

  // Tendang ke halaman login bila sesi tidak ada
  if (!isPublicRoute && session !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Lempar ke Dashboard jika sudah Login namun memaksa mau mengakses /login
  if (isPublicRoute && session === 'authenticated') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/telegram|_next/static|_next/image|favicon.ico).*)'],
}

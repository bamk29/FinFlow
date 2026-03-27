import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Proxy: menggantikan middleware.ts di Next.js 16+
// Fungsi: proteksi akses Dashboard dengan sesi cookie sederhana
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Izinkan akses API Telegram (Webhook) tanpa proteksi
  if (path.startsWith('/api/telegram')) {
    return NextResponse.next()
  }

  // Cek sesi otentikasi
  const session = request.cookies.get('finflow_session')?.value
  const isPublicRoute = path === '/login'

  // Redirect ke login jika belum ada sesi
  if (!isPublicRoute && session !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect ke Dashboard jika sudah login tapi mengakses /login
  if (isPublicRoute && session === 'authenticated') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/telegram|_next/static|_next/image|favicon.ico).*)'],
}

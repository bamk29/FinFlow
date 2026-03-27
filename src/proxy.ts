import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Proxy: pengganti middleware.ts di Next.js 16+
// Fungsi: proteksi akses Dashboard dengan sesi cookie sederhana
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Izinkan akses ke semua API routes dan aset statis
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.includes('.') // File statis (favicon, svg, dll)
  ) {
    return NextResponse.next()
  }

  // Cek sesi otentikasi
  const session = request.cookies.get('finflow_session')?.value
  const isLoginPage = path === '/login'

  // Jika belum login dan bukan di halaman login, redirect ke login
  if (!isLoginPage && session !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login tapi mengakses /login, redirect ke dashboard
  if (isLoginPage && session === 'authenticated') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

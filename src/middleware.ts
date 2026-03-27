import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('finflow_session');
  const { pathname } = request.nextUrl;

  // Izinkan akses ke API telegram dan login tanpa proteksi
  if (pathname.startsWith('/api/telegram') || pathname.startsWith('/api/auth/login') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Redirect ke login jika tidak ada sesi
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Hanya proteksi rute dasbor dan ide
export const config = {
  matcher: ['/', '/reports/:path*', '/ideas/:path*', '/add/:path*'],
};

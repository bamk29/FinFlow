import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Ambil password benar dari environment variable
    const correctPassword = process.env.WEB_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: 'Sistem belum dikonfigurasi admin (WEB_PASSWORD kosong)' }, { status: 500 });
    }

    if (password === correctPassword) {
      // Set cookie sesi sederhana. Secara produksi disarankan menggunakan JWT / enkripsi panjang.
      const cookieStore = await cookies();
      cookieStore.set('finflow_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 hari
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 });
  }
}

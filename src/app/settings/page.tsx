'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LogOut, Moon, Sun, Info, Shield, Database, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Halaman pengaturan aplikasi: tema, logout, dan info sistem
export default function SettingsPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    // Hapus cookie sesi dengan mengatur expired
    document.cookie = 'finflow_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
    router.refresh();
  };

  return (
    <MainLayout>
      <header className="mb-4">
        <h1 className="text-xl font-bold text-primary">Pengaturan ⚙️</h1>
        <p className="text-[11px] text-muted-foreground">Kelola tampilan dan keamanan akun Anda.</p>
      </header>

      <div className="space-y-3 max-w-lg">
        {/* Tema */}
        <Card className="shadow-none border-muted">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-bold">Tampilan Layar</p>
                <p className="text-[11px] text-muted-foreground">Saat ini: {isDark ? 'Mode Gelap 🌙' : 'Mode Terang ☀️'}</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="px-4 py-2 text-xs font-bold bg-secondary rounded-lg hover:bg-muted transition-colors">
              {isDark ? 'Ganti Terang' : 'Ganti Gelap'}
            </button>
          </CardContent>
        </Card>

        {/* Info Aplikasi */}
        <Card className="shadow-none border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-5 h-5 text-primary" />
              <p className="text-sm font-bold">Informasi Aplikasi</p>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1.5 border-b border-dashed">
                <span className="text-muted-foreground flex items-center gap-1.5"><Shield className="w-3 h-3" /> Versi</span>
                <span className="font-bold">FinFlow v1.0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed">
                <span className="text-muted-foreground flex items-center gap-1.5"><Database className="w-3 h-3" /> Framework</span>
                <span className="font-bold">Next.js 16 + Supabase</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5"><Bot className="w-3 h-3" /> Bot Telegram</span>
                <span className="font-bold text-emerald-500">Aktif ✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-none border-rose-500/20 bg-rose-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-rose-500" />
              <div>
                <p className="text-sm font-bold text-rose-600">Keluar dari Dashboard</p>
                <p className="text-[11px] text-muted-foreground">Sesi Anda akan dihapus dari perangkat ini.</p>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
              Logout
            </button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

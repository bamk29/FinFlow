'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, Moon, Sun, Info, Shield, Database, Bot, ExternalLink, MessageCircle, CheckCircle2, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Halaman pengaturan: tema, info, bot telegram, logout
export default function SettingsPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [botStatus, setBotStatus] = useState<'loading'|'active'|'error'>('loading');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    // Cek status webhook bot
    fetch('https://api.telegram.org/bot8711901469:AAG__6537ojySrTpBqSp0q0PGYU1zqOk4oU/getWebhookInfo')
      .then(r => r.json())
      .then(data => {
        setBotStatus(data.result?.url ? 'active' : 'error');
      })
      .catch(() => setBotStatus('error'));
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

  const handleLogout = () => {
    document.cookie = 'finflow_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
    router.refresh();
  };

  return (
    <MainLayout>
      <header className="mb-4">
        <h1 className="text-xl font-bold text-primary">Pengaturan ⚙️</h1>
        <p className="text-[11px] text-muted-foreground">Kelola tampilan, bot, dan keamanan.</p>
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

        {/* Bot Telegram */}
        <Card className="shadow-none border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-5 h-5 text-blue-500" />
              <p className="text-sm font-bold">Bot Telegram</p>
              {/* Status indikator */}
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                botStatus === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                botStatus === 'error' ? 'bg-rose-500/10 text-rose-600' :
                'bg-muted text-muted-foreground'
              }`}>
                {botStatus === 'active' ? <><CheckCircle2 className="w-3 h-3" /> Terhubung</> :
                 botStatus === 'error' ? <><Wifi className="w-3 h-3" /> Tidak Aktif</> :
                 'Mengecek...'}
              </span>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1.5 border-b border-dashed">
                <span className="text-muted-foreground">Nama Bot</span>
                <span className="font-bold">@FinFlowKeluargaBot</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed">
                <span className="text-muted-foreground">Webhook</span>
                <span className="font-bold text-[11px]">bkfinflow.vercel.app/api/telegram</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed">
                <span className="text-muted-foreground">Fitur Bot</span>
                <span className="font-bold">Catat Uang, Tagihan, Cek Saldo</span>
              </div>
            </div>

            {/* Aksi Bot */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href="https://t.me/FinFlowKeluargaBot" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Buka Telegram
              </a>
              <a href="https://api.telegram.org/bot8711901469:AAG__6537ojySrTpBqSp0q0PGYU1zqOk4oU/setWebhook?url=https://bkfinflow.vercel.app/api/telegram" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-muted transition-colors">
                <Wifi className="w-3.5 h-3.5" /> Aktifkan Webhook
              </a>
            </div>

            {/* Panduan singkat */}
            <div className="mt-3 p-2.5 bg-blue-500/5 rounded-lg">
              <p className="text-[11px] font-bold text-blue-600 mb-1">📱 Cara Pakai Bot:</p>
              <ol className="text-[10px] text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Buka Telegram, cari <b>@FinFlowKeluargaBot</b></li>
                <li>Ketik <b>/start</b> untuk memulai</li>
                <li>Pilih menu: Catat Pemasukan, Pengeluaran, atau Tagihan</li>
                <li>Data otomatis muncul di Dashboard Web ini!</li>
              </ol>
            </div>
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
                <span className="font-bold">FinFlow v2.0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed">
                <span className="text-muted-foreground flex items-center gap-1.5"><Database className="w-3 h-3" /> Database</span>
                <span className="font-bold">Supabase PostgreSQL</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5"><ExternalLink className="w-3 h-3" /> Hosting</span>
                <span className="font-bold">Vercel (Serverless)</span>
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
                <p className="text-[11px] text-muted-foreground">Sesi akan dihapus dari perangkat ini.</p>
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

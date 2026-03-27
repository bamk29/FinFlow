'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Home, PieChart, PlusCircle, Settings, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: PieChart, label: 'Laporan', href: '/reports' },
  { icon: PlusCircle, label: 'Tambah', href: '/add', activeOnly: true },
  { icon: ListTodo, label: 'Ide & Rencana', href: '/ideas' },
  { icon: Settings, label: 'Pengaturan', href: '/settings' },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Pemeriksaan awal untuk merender ikon mode sesuai dengan pengaturan OS/Pilihan saat ini
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));
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

  return (
    <div className="flex bg-background min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r bg-card/50 backdrop-blur-xl sticky top-0 h-screen transition-all">
        <div className="p-4 border-b">
          <h1 className="text-xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tight">FinFlow 🌻</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Buku Catatan Keluarga</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.activeOnly && !isActive) return null; // Only show 'Tambah' button differently or as normal item
            return (
              <Link key={item.href} href={item.href}>
                <span className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all group",
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}>
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-all">
            <span className="text-xl">{isDark ? '☀️' : '🌙'}</span> 
            {isDark ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {/* Tombol Tema Mobile (Hanya muncul di HP) */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={toggleTheme} className="p-2 bg-muted rounded-full shadow-sm flex items-center gap-2 text-sm font-bold">
              {isDark ? '☀️ Ubah Terang' : '🌙 Mode Gelap'}
            </button>
          </div>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Glassmorphism) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-background/80 backdrop-blur-xl border shadow-lg rounded-2xl p-2 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCenter = item.label === 'Tambah';
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex justify-center">
              <span className="relative flex flex-col items-center justify-center w-full h-full py-2">
                {isCenter ? (
                  <div className="absolute -top-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg shadow-primary/30 transform transition-transform active:scale-95">
                    <item.icon className="w-6 h-6" />
                  </div>
                ) : (
                  <>
                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                      />
                    )}
                  </>
                )}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}

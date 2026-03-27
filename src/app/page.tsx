import { db } from '@/lib/db';
import { transactions, ideas } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, ArrowDownRight, ArrowUpRight, Activity, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.date)).limit(100);
  const activeIdeas = await db.select().from(ideas).orderBy(desc(ideas.createdAt)).limit(10);
  
  const totalIn = allTransactions.filter(t => t.type === 'in').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalOut = allTransactions.filter(t => t.type === 'out').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const recentTransactions = allTransactions.slice(0, 5);

  return (
    <MainLayout>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">Kondisi Uang Kita 🏡</h1>
          <p className="text-[11px] text-muted-foreground">Ringkasan cepat dompet keluarga Anda.</p>
        </div>
        <Link href="/add" className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5 text-xs font-bold">
          <PlusCircle className="w-4 h-4" /> Catat Uang
        </Link>
      </header>

      {/* Overview Cards - Ultra Compact & Clickable */}
      <div className="grid gap-2 grid-cols-2 lg:grid-cols-4 mb-4">
        <Link href="/reports">
          <Card className="border-primary/10 shadow-none hover:bg-muted/30 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">SALDO SISA</p>
              <div className="text-lg font-black text-primary">Rp {(totalIn - totalOut).toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="border-emerald-500/10 shadow-none hover:bg-emerald-500/5 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <p className="text-[10px] font-bold text-emerald-600/70 uppercase mb-1">UANG MASUK</p>
              <div className="text-lg font-black text-emerald-600">Rp {totalIn.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="border-rose-500/10 shadow-none hover:bg-rose-500/5 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <p className="text-[10px] font-bold text-rose-600/70 uppercase mb-1">PENGELUARAN</p>
              <div className="text-lg font-black text-rose-600">Rp {totalOut.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ideas">
          <Card className="border-blue-500/10 shadow-none hover:bg-blue-500/5 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <p className="text-[10px] font-bold text-blue-600/70 uppercase mb-1">RENCANA</p>
              <div className="text-lg font-black text-blue-600">{activeIdeas.length} Item</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-7 items-start">
        {/* Recent Transactions - Compact List */}
        <div className="md:col-span-4 bg-card border rounded-xl overflow-hidden shadow-none">
          <div className="p-3 px-4 bg-muted/20 border-b flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catatan Terakhir</h3>
            <Link href="/reports" className="text-[10px] font-bold text-primary hover:underline">Lihat Semua →</Link>
          </div>
          <div className="divide-y text-[13px]">
            {recentTransactions.map((trx) => (
              <div key={trx.id} className="flex justify-between items-center p-3 px-4 hover:bg-muted/10 transition-colors">
                <div className="flex flex-col">
                  <span className="font-bold">{trx.title}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(trx.date).toLocaleDateString('id-ID', { day:'2-digit', month:'short' })} • {new Date(trx.date).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <div className={`font-black text-sm ${trx.type === 'in' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {trx.type === 'in' ? '+' : '-'}{parseFloat(trx.amount).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground italic">Belum ada transaksi hari ini.</div>}
          </div>
        </div>

        {/* Ideas / Bills - Compact List */}
        <div className="md:col-span-3 bg-card border rounded-xl overflow-hidden shadow-none">
          <div className="p-3 px-4 bg-muted/20 border-b flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">💡 Rencana & Tagihan</h3>
            <Link href="/ideas" className="text-[10px] font-bold text-primary hover:underline">Buka Papan →</Link>
          </div>
          <div className="divide-y text-[13px]">
            {activeIdeas.slice(0, 4).map((idea) => {
               const isBill = idea.description?.includes('Tagihan');
               return (
                <div key={idea.id} className="p-3 px-4 hover:bg-muted/10 transition-colors">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-bold truncate pr-2">{idea.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${isBill ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'}`}>Aktif</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 italic">{idea.description?.split('|')[1]?.trim() || "Tidak ada rincian dana."}</p>
                </div>
              )
            })}
            {activeIdeas.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground italic">Papan rencana kosong.</div>}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

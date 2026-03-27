'use client';

import { useState, useMemo, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { Search, Filter, Pencil, Trash2, Check, X, CalendarDays, CalendarRange } from 'lucide-react';
import { deleteTransaction, editTransaction } from '@/app/actions/transaction';
import { useRouter } from 'next/navigation';

export function ReportsClientUI({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filterMode, setFilterMode] = useState<'daily'|'range'>('daily');
  const [singleDate, setSingleDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const filteredData = useMemo(() => {
    return initialData.filter(trx => {
      if (searchQuery && !trx.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (typeFilter !== 'all' && trx.type !== typeFilter) return false;
      
      const trxDate = new Date(trx.date);
      if (filterMode === 'daily') {
         if (singleDate) {
           const sDate = new Date(singleDate);
           if (trxDate.getDate() !== sDate.getDate() || trxDate.getMonth() !== sDate.getMonth() || trxDate.getFullYear() !== sDate.getFullYear()) return false;
         }
      } else {
         if (startDate && trxDate < new Date(startDate)) return false;
         if (endDate && trxDate > new Date(endDate + 'T23:59:59')) return false;
      }
      return true;
    });
  }, [initialData, searchQuery, typeFilter, filterMode, singleDate, startDate, endDate]);

  const totalIn = filteredData.filter(t => t.type === 'in').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalOut = filteredData.filter(t => t.type === 'out').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const handleDelete = (id: string) => {
    if (confirm("Hapus catatan ini?")) {
      startTransition(async () => {
        await deleteTransaction(id);
        router.refresh();
      });
    }
  };

  const handleStartEdit = (trx: any) => {
    setEditingId(trx.id);
    setEditTitle(trx.title);
    setEditAmount(trx.amount);
  };

  const handleSaveEdit = (id: string) => {
    startTransition(async () => {
      await editTransaction(id, editAmount, editTitle);
      setEditingId(null);
      router.refresh();
    });
  };

  return (
    <MainLayout>
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">Laporan & Riwayat 📊</h1>
        <div className="flex bg-muted rounded-lg p-1 scale-90 origin-right">
           <button onClick={() => setFilterMode('daily')} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 ${filterMode === 'daily' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}><CalendarDays className="w-3.5 h-3.5"/> Harian</button>
           <button onClick={() => setFilterMode('range')} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 ${filterMode === 'range' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}><CalendarRange className="w-3.5 h-3.5"/> Bulanan</button>
        </div>
      </header>

      <div className="grid gap-2 grid-cols-2 mb-4">
        <Card className="bg-emerald-500/5 border-emerald-500/10 shadow-none"><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-emerald-600/70">Pemasukan</p><div className="text-lg font-black text-emerald-600">Rp {totalIn.toLocaleString('id-ID')}</div></CardContent></Card>
        <Card className="bg-rose-500/5 border-rose-500/10 shadow-none"><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-rose-600/70">Pengeluaran</p><div className="text-lg font-black text-rose-600">Rp {totalOut.toLocaleString('id-ID')}</div></CardContent></Card>
      </div>

      <Card className="mb-4 shadow-none border-muted">
        <CardContent className="p-3 grid gap-3 grid-cols-1 md:grid-cols-12 items-end">
          {filterMode === 'daily' ? (
             <div className="md:col-span-3"><label className="text-[10px] font-bold text-muted-foreground ml-1">TANGGAL</label><input type="date" value={singleDate} onChange={(e) => setSingleDate(e.target.value)} className="w-full p-2 text-xs border rounded-lg" /></div>
          ) : (
             <div className="md:col-span-6 flex gap-2">
               <div className="flex-1"><label className="text-[10px] font-bold text-muted-foreground ml-1">DARI</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 text-xs border rounded-lg" /></div>
               <div className="flex-1"><label className="text-[10px] font-bold text-muted-foreground ml-1">SAMPAI</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 text-xs border rounded-lg" /></div>
             </div>
          )}
          <div className="md:col-span-3"><label className="text-[10px] font-bold text-muted-foreground ml-1">CARI</label><div className="relative"><Search className="w-3 h-3 absolute left-2 top-2.5 text-muted-foreground"/><input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-7 p-2 text-xs border rounded-lg" /></div></div>
          <div className="md:col-span-3"><label className="text-[10px] font-bold text-muted-foreground ml-1">TIPE</label><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full p-2 text-xs border rounded-lg bg-background"><option value="all">Semua</option><option value="in">Masuk</option><option value="out">Keluar</option></select></div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-muted overflow-hidden">
        <CardContent className="p-0 text-[13px]">
          {/* Wrapper scroll horizontal agar tabel bisa digeser di HP */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '520px' }}>
              <thead className="bg-muted/30 text-[10px] text-muted-foreground uppercase">
                <tr className="border-b">
                  <th className="p-2 px-4 text-left font-bold">Keterangan</th>
                  <th className="p-2 px-3 text-left font-bold" style={{ minWidth: '80px' }}>Waktu</th>
                  <th className="p-2 px-4 text-right font-bold" style={{ minWidth: '100px' }}>Nominal</th>
                  <th className="p-2 px-4 text-center font-bold" style={{ minWidth: '90px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-muted/20 transition-colors">
                    {editingId === trx.id ? (
                      <>
                        <td className="p-2 px-3"><input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full p-1.5 border rounded text-xs font-bold bg-background" /></td>
                        <td className="p-2 px-3 text-[10px] text-muted-foreground">Editing..</td>
                        <td className="p-2 px-3"><input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} className="w-full p-1.5 border rounded text-right text-xs font-bold bg-background" /></td>
                        <td className="p-2 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleSaveEdit(trx.id)} className="p-2 bg-emerald-500 text-white rounded-md"><Check className="w-3.5 h-3.5"/></button>
                            <button onClick={() => setEditingId(null)} className="p-2 bg-muted rounded-md"><X className="w-3.5 h-3.5"/></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 px-4 font-bold">
                          <span>{trx.title}</span>
                          <span className={`block text-[10px] w-fit px-1.5 py-0.5 rounded opacity-80 mt-1 ${trx.type === 'in' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{trx.type === 'in' ? 'Masuk' : 'Keluar'}</span>
                        </td>
                        <td className="p-3 px-3 text-[10px] text-muted-foreground whitespace-nowrap">{new Date(trx.date).toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit'})} • {new Date(trx.date).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</td>
                        <td className={`p-3 px-4 text-right font-black whitespace-nowrap ${trx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>{trx.type === 'in' ? '+' : '-'}{parseFloat(trx.amount).toLocaleString('id-ID')}</td>
                        <td className="p-2 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleStartEdit(trx)} className="p-2 bg-secondary rounded-md hover:bg-muted transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5"/>
                            </button>
                            <button onClick={() => handleDelete(trx.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-md hover:bg-rose-500/20 transition-colors" title="Hapus">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredData.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-xs text-muted-foreground">Kosong.</td></tr>)}
              </tbody>
            </table>
          </div>
          {/* Petunjuk geser di HP */}
          <p className="text-[9px] text-center text-muted-foreground py-1.5 bg-muted/20 md:hidden">← Geser tabel untuk lihat tombol Aksi →</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

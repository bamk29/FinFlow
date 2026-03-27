'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, Banknote, ShoppingBag, PlusSquare, Trash2, X } from 'lucide-react';
import { addPlanning, deleteIdea } from '@/app/actions/idea';
import { useEffect, useState, useTransition } from 'react';

// Tipe data rencana/tagihan
type Idea = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  createdAt: string;
};

// Komponen kartu rencana individual
function IdeaCard({ item, color, onDelete }: { item: Idea; color: string; onDelete: (id: string) => void }) {
  const biaya = item.description?.split('|')[1]?.trim() || 'Biaya belum diset';
  const colorMap: Record<string, string> = {
    rose: 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40',
    blue: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${colorMap[color] || ''}`}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold truncate">{item.title}</p>
        <p className="text-[11px] text-muted-foreground">{biaya}</p>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="ml-2 p-1.5 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
        title="Hapus rencana ini"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function IdeasClientPage({ initialData }: { initialData: Idea[] }) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  // Kategori filter
  const bills = data.filter(i => (i.description || '').includes('Tagihan'));
  const dues = data.filter(i => (i.description || '').includes('Iuran'));
  const shopping = data.filter(i => (i.description || '').includes('Belanja') || !(i.description || '').includes('Kategori:'));

  const handleDelete = (id: string) => {
    if (!confirm('Yakin hapus rencana ini?')) return;
    // Optimistic UI: hapus dari tampilan dulu
    setData(prev => prev.filter(i => i.id !== id));
    startTransition(async () => {
      await deleteIdea(id);
    });
  };

  // Total estimasi biaya
  const totalEstimasi = data.reduce((acc, item) => {
    const match = item.description?.match(/Rp ([\d.,]+)/);
    if (match) {
      const num = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
      return acc + (isNaN(num) ? 0 : num);
    }
    return acc;
  }, 0);

  return (
    <MainLayout>
      <header className="mb-4">
        <h1 className="text-xl font-bold text-primary">Tagihan & Rencana 📝</h1>
        <p className="text-[11px] text-muted-foreground">Catat semua tagihan, iuran, dan rencana belanja keluarga.</p>
      </header>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-muted-foreground">Tagihan</p>
          <p className="text-lg font-black text-rose-500">{bills.length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-muted-foreground">Iuran</p>
          <p className="text-lg font-black text-blue-500">{dues.length}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-muted-foreground">Belanja</p>
          <p className="text-lg font-black text-emerald-500">{shopping.length}</p>
        </div>
      </div>

      {/* Form Tambah (Compact) */}
      <Card className="mb-4 shadow-none border-primary/20">
        <CardContent className="p-3">
          <form action={addPlanning} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-muted-foreground">Nama Rencana</label>
              <input type="text" name="title" placeholder="Contoh: SPP Anak, Arisan..." required className="w-full text-sm p-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Jenis</label>
              <select name="category" required className="w-full text-sm p-2 border rounded-lg bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="Tagihan">🧾 Tagihan</option>
                <option value="Iuran">💸 Iuran</option>
                <option value="Belanja">🛒 Belanja</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Biaya (Rp)</label>
              <input type="number" name="amount" placeholder="Opsional" className="w-full text-sm p-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="submit" className="col-span-2 md:col-span-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98]">
              ＋ Tambah ke Daftar
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Daftar Rencana 3 Kolom */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tagihan */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-1.5 border-b border-rose-500/30 pb-1.5">
            <Receipt className="w-4 h-4 text-rose-500" /> Wajib Dibayar
          </h2>
          {bills.map(item => <IdeaCard key={item.id} item={item} color="rose" onDelete={handleDelete} />)}
          {bills.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-3 bg-muted/20 rounded-lg">Aman, tidak ada tagihan.</p>}
        </div>

        {/* Iuran */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-1.5 border-b border-blue-500/30 pb-1.5">
            <Banknote className="w-4 h-4 text-blue-500" /> Iuran RT / Arisan
          </h2>
          {dues.map(item => <IdeaCard key={item.id} item={item} color="blue" onDelete={handleDelete} />)}
          {dues.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-3 bg-muted/20 rounded-lg">Tidak ada iuran tercatat.</p>}
        </div>

        {/* Belanja */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-1.5 border-b border-emerald-500/30 pb-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-500" /> Rencana Belanja
          </h2>
          {shopping.map(item => <IdeaCard key={item.id} item={item} color="emerald" onDelete={handleDelete} />)}
          {shopping.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-3 bg-muted/20 rounded-lg">Papan belanja masih kosong.</p>}
        </div>
      </div>

      {/* Footer Estimasi */}
      {totalEstimasi > 0 && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
          <p className="text-[11px] text-muted-foreground">Total Estimasi Pengeluaran Mendatang</p>
          <p className="text-lg font-black text-primary">Rp {totalEstimasi.toLocaleString('id-ID')}</p>
        </div>
      )}
    </MainLayout>
  );
}

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { addTransaction } from '@/app/actions/transaction';

// Halaman input transaksi baru: compact mode dengan kategori dan tanggal
export default function AddPage() {
  return (
    <MainLayout>
      <header className="mb-4">
        <h1 className="text-xl font-bold text-primary">Catat Uang Baru 💸</h1>
        <p className="text-[11px] text-muted-foreground">Hari ini habis belanja apa? Atau dapat rezeki dari mana?</p>
      </header>

      <Card className="max-w-lg shadow-none border-primary/20">
        <CardContent className="p-4">
          <form action={addTransaction} className="space-y-3">
            {/* Nominal */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Berapa Uangnya? (Rp)</label>
              <input 
                type="number" 
                name="amount" 
                placeholder="Contoh: 50000" 
                required 
                className="w-full text-xl p-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold transition-all bg-background"
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Uang Untuk Apa?</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Contoh: Beli Sate, Bayar Listrik, Gaji Ayah..." 
                required 
                className="w-full text-sm p-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-background"
              />
            </div>

            {/* Kategori & Tanggal (Grid 2 kolom) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground">Kategori</label>
                <select 
                  name="category" 
                  className="w-full text-sm p-3 border-2 border-primary/20 rounded-xl bg-background appearance-none focus:outline-none focus:ring-4 focus:ring-primary/20"
                >
                  <option value="Umum">📦 Umum</option>
                  <option value="Makan">🍛 Makan & Minum</option>
                  <option value="Transport">🚗 Transportasi</option>
                  <option value="Belanja">🛒 Belanja</option>
                  <option value="Tagihan">🧾 Tagihan</option>
                  <option value="Pendidikan">📚 Pendidikan</option>
                  <option value="Kesehatan">🏥 Kesehatan</option>
                  <option value="Hiburan">🎬 Hiburan</option>
                  <option value="Gaji">💰 Gaji/Penghasilan</option>
                  <option value="Lainnya">📌 Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground">Tanggal (Opsional)</label>
                <input 
                  type="date" 
                  name="date" 
                  className="w-full text-sm p-3 border-2 border-primary/20 rounded-xl bg-background focus:outline-none focus:ring-4 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                type="submit" 
                name="type" 
                value="in" 
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                ＋ Uang Masuk
              </button>
              <button 
                type="submit" 
                name="type" 
                value="out" 
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
              >
                ー Uang Keluar
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

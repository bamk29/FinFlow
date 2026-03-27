import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addTransaction } from '@/app/actions/transaction';

export default function AddPage() {
  return (
    <MainLayout>
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-primary">Catat Uang Baru 💸</h1>
        <p className="text-muted-foreground mt-2 text-lg">Hari ini habis belanja apa? Atau dapat rezeki dari mana?</p>
      </header>

      <Card className="max-w-xl border-primary/20 shadow-xl">
        <CardHeader className="bg-primary/5 rounded-t-xl border-b border-primary/10">
          <CardTitle className="text-2xl">Buku Catatan</CardTitle>
          <CardDescription className="text-base">Isi nominal dan keterangan di bawah ini.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={addTransaction} className="space-y-6">
            <div className="space-y-3">
              <label className="text-lg font-bold text-foreground">Berapa Uangnya? (Rp)</label>
              <input 
                type="number" 
                name="amount" 
                placeholder="Contoh: 50000" 
                required 
                className="w-full text-2xl p-4 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-foreground">Uang Untuk Apa?</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Contoh: Beli Sate, Bayar Listrik, Gaji Ayah..." 
                required 
                className="w-full text-xl p-4 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <button 
                type="submit" 
                name="type" 
                value="in" 
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transform active:scale-95 transition-all"
              >
                + Uang Masuk
              </button>
              
              <button 
                type="submit" 
                name="type" 
                value="out" 
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white text-xl font-bold rounded-2xl shadow-lg shadow-rose-500/30 transform active:scale-95 transition-all"
              >
                - Uang Keluar
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

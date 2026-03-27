import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { ideas } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Lightbulb, Receipt, ShoppingBag, Banknote, PlusSquare } from 'lucide-react';
import { addPlanning } from '@/app/actions/idea';

export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  const allIdeas = await db.select().from(ideas).orderBy(desc(ideas.createdAt));

  // Pemfilteran UI sederhana
  const bills = allIdeas.filter(i => (i.description || '').includes('Tagihan'));
  const dues = allIdeas.filter(i => (i.description || '').includes('Iuran'));
  const shopping = allIdeas.filter(i => (i.description || '').includes('Belanja') || !(i.description || '').includes('Kategori:'));

  return (
    <MainLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-primary">Tagihan & Rencana 📝</h1>
        <p className="text-muted-foreground mt-2 text-lg">Jangan sampai ada tagihan ibu yang terlewat! Bebaskan pikiran dengan mencatat semuanya di sini.</p>
      </header>

      {/* Form Tambah Rencana Cepat */}
      <Card className="mb-10 bg-primary/5 border-primary/20 shadow-sm">
        <CardHeader className="pb-3 border-b border-primary/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <PlusSquare className="text-primary" /> Tambah Rencana Baru
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <form action={addPlanning} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <label className="font-bold">Mau Bayar / Beli Apa?</label>
              <input type="text" name="title" placeholder="Contoh: SPP Anak, Arisan, Token Listrik..." required className="w-full text-lg p-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20" />
            </div>
            
            <div className="space-y-2">
              <label className="font-bold">Jenis Rencana</label>
              <select name="category" required className="w-full text-lg p-3 border-2 border-primary/20 rounded-xl bg-background appearance-none focus:outline-none focus:ring-4 focus:ring-primary/20">
                <option value="Tagihan">🧾 Tagihan (Pasti)</option>
                <option value="Iuran">💸 Iuran Bulanan</option>
                <option value="Belanja">🛒 Rencana Belanja</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold">Perkiraan Biaya (Rp)</label>
              <input type="number" name="amount" placeholder="Opsional..." className="w-full text-lg p-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20" />
            </div>

            <button type="submit" className="md:col-span-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl shadow-md transform active:scale-[0.98] transition-all">
              Simpan ke Dalam Daftar
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Kolom 1: Tagihan */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b-2 border-rose-500 pb-2">
            <Receipt className="text-rose-500" /> Wajib Dibayar
          </h2>
          {bills.map(item => (
            <Card key={item.id} className="border-rose-500/20 bg-rose-500/5 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-foreground/80 font-medium">
                {item.description?.split('|')[1]?.trim() || "Biaya belum diset"}
              </CardContent>
            </Card>
          ))}
          {bills.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg">Aman, tidak ada tagihan nyangkut.</p>}
        </div>

        {/* Kolom 2: Iuran */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b-2 border-blue-500 pb-2">
            <Banknote className="text-blue-500" /> Iuran RT / Arisan
          </h2>
          {dues.map(item => (
            <Card key={item.id} className="border-blue-500/20 bg-blue-500/5 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-foreground/80 font-medium">
                {item.description?.split('|')[1]?.trim() || "Biaya belum diset"}
              </CardContent>
            </Card>
          ))}
          {dues.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg">Tidak ada iuran tercatat.</p>}
        </div>

        {/* Kolom 3: Belanja Wishlist */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b-2 border-emerald-500 pb-2">
            <ShoppingBag className="text-emerald-500" /> Rencana Belanja / Ide
          </h2>
          {shopping.map(item => (
            <Card key={item.id} className="border-emerald-500/20 bg-emerald-500/5 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 pl-4 border-l-2 border-emerald-500/30 text-sm text-foreground/80">
                {item.description?.replace('via Telegram Interactive', 'Dari Telegram') || "Tidak ada rincian."}
              </CardContent>
            </Card>
          ))}
          {shopping.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg">Papan belanja masih kosong.</p>}
        </div>
      </div>
    </MainLayout>
  );
}

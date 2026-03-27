import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, ArrowUpRight, Plus, Search, Filter, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TransactionsPage() {
  const transactions = [
    { id: 1, name: 'Gaji Freelance - Web Design', amount: '+Rp 2.500.000', type: 'in', date: '25 Okt 2026', category: 'Income' },
    { id: 2, name: 'Supermarket', amount: '-Rp 250.000', type: 'out', date: '24 Okt 2026', category: 'Food' },
    { id: 3, name: 'Ojek Online', amount: '-Rp 35.000', type: 'out', date: '24 Okt 2026', category: 'Transport' },
    { id: 4, name: 'Langganan Spotify', amount: '-Rp 55.000', type: 'out', date: '22 Okt 2026', category: 'Entertainment' },
    { id: 5, name: 'Jual Barang Bekas', amount: '+Rp 150.000', type: 'in', date: '20 Okt 2026', category: 'Other Income' },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Semua Transaksi</h1>
          <p className="text-muted-foreground mt-1">Kelola masuk dan keluarnya dana dengan mudah.</p>
        </header>
        <Button className="w-full md:w-auto gap-2">
          <Plus className="w-4 h-4" /> Catat Transaksi
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Cari transaksi..." className="pl-8 bg-background" />
            </div>
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <Filter className="w-4 h-4" /> Filter / Kategori
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full hidden sm:flex ${t.type === 'in' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {t.type === 'in' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">{t.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{t.date}</span>
                      <span>•</span>
                      <span className="bg-secondary px-2 py-0.5 rounded-full">{t.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`font-bold text-sm md:text-base text-right ${t.type === 'in' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    {t.amount}
                  </div>
                  {/* CRUD Actions */}
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hidden sm:inline-flex"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hidden sm:inline-flex"><Trash className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden"><MoreHorizontal className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

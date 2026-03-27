'use server';

import { db } from '@/lib/db';
import { transactions, users, wallets } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function addTransaction(formData: FormData) {
  const amount = Number(formData.get('amount'));
  const title = formData.get('title') as string;
  const type = formData.get('type') as 'in' | 'out';

  if (!amount || !title) return;

  // Karena belum ada sistem login Web rumit, kita asumsikan ini masuk ke Dompet Utama "Keluarga"
  // Mencari dompet yang ada, atau membuat pancingan dummy jika benar-benar kosong
  let firstWallet = await db.select().from(wallets).limit(1);
  let walletId = firstWallet[0]?.id;

  if (!walletId) {
    const [newW] = await db.insert(wallets).values({ name: 'Dompet Keluarga' }).returning();
    walletId = newW.id;
  }

  await db.insert(transactions).values({
    walletId,
    amount: amount.toString(),
    type,
    category: 'Umum',
    title,
  } as any);

  revalidatePath('/');
  revalidatePath('/reports');
  redirect('/');
}

export async function deleteTransaction(id: string) {
  await db.delete(transactions).where(eq(transactions.id, id as any));
  revalidatePath('/reports');
  revalidatePath('/');
}

export async function editTransaction(id: string, amount: string, title: string) {
  await db.update(transactions)
    .set({ amount, title })
    .where(eq(transactions.id, id as any));
  revalidatePath('/reports');
  revalidatePath('/');
}

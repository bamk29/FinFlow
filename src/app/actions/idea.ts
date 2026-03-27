'use server';

import { db } from '@/lib/db';
import { ideas, wallets } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addPlanning(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const amountRaw = formData.get('amount') as string;

  if (!title || !category) return;

  // Format deskripsi pintar: Memadukan kategori dan nominal menjadi satu strings agar tidak perlu alter database skema
  const amountFmt = amountRaw ? `Rp ${Number(amountRaw).toLocaleString('id-ID')}` : 'Belum Ditentukan';
  const description = `Kategori: ${category} | Perkiraan Dana: ${amountFmt}`;

  // Ambil dompet utama
  let firstWallet = await db.select().from(wallets).limit(1);
  let walletId = firstWallet[0]?.id;

  if (!walletId) {
    const [newW] = await db.insert(wallets).values({ name: 'Dompet Keluarga' }).returning();
    walletId = newW.id;
  }

  await db.insert(ideas).values({
    walletId,
    title,
    description,
    status: 'Idea'
  } as any);

  revalidatePath('/ideas');
  redirect('/ideas');
}

// Hapus rencana/tagihan berdasarkan ID
export async function deleteIdea(id: string) {
  const { eq } = await import('drizzle-orm');
  await db.delete(ideas).where(eq(ideas.id, id as any));
  revalidatePath('/ideas');
  revalidatePath('/');
}

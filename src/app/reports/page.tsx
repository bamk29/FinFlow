import { db } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { ReportsClientUI } from './client-ui';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.date));

  return (
    <ReportsClientUI initialData={allTransactions} />
  );
}

import { db } from '@/lib/db';
import { ideas } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import IdeasClientPage from './client-ui';

export const dynamic = 'force-dynamic';

// Server component: fetch data lalu kirim ke client component
export default async function IdeasPage() {
  const allIdeas = await db.select().from(ideas).orderBy(desc(ideas.createdAt));
  return <IdeasClientPage initialData={allIdeas as any} />;
}

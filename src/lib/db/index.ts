import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ CRITICAL: DATABASE_URL tidak ditemukan di .env.local!");
  process.exit(1);
}

// Singleton pattern untuk mencegah kebocoran koneksi saat Hot-Reload Next.js
// Supabase Transaction Pooler memiliki limitasi MaxClients yang ketat dalam mode sesi.
const globalForDb = global as unknown as {
  client: postgres.Sql | undefined;
};

// Gunakan limit pool kecil (max: 1) untuk dev lingkungan agar tidak menabrak batas Supabase
export const client = globalForDb.client ?? postgres(connectionString, { 
    prepare: false, 
    max: 1,
    idle_timeout: 20
});

if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, { schema });

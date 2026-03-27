import { pgTable, text, timestamp, integer, uuid, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 1. Wallets (Shared Space untuk Suami & Istri atau personal)
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Users (Supabase Auth ID atau Telegram ID bisa di-binding)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  telegramId: text('telegram_id').unique(), // Untuk binding dari Bot
  name: text('name'),
  walletId: uuid('wallet_id').references(() => wallets.id).notNull(), // Menunjuk ke shared wallet
  role: text('role').default('member'), // admin / member
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enum tipe transaksi
export const transactionTypeEnum = pgEnum('transaction_type', ['in', 'out']);

// 3. Transactions (Mencatat pemasukan/pengeluaran)
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id').references(() => wallets.id).notNull(),
  createdBy: uuid('created_by').references(() => users.id), // Siapa yang nyatet (Suami/Istri)
  
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  category: text('category').notNull(), // Makan, Transport, Gaji, dll (bisa pakai tabel terpisah, tapi string dulu untuk MVP NLP Bot)
  title: text('title').notNull(),
  description: text('description'),
  customTag: text('custom_tag'), // Misalnya #investasi, #liburan (sesuai request Custom Tag)
  
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Ideas / Planning
export const ideas = pgTable('ideas', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id').references(() => wallets.id).notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('Idea'), // Idea, Planning, In Progress, Done
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

# FinFlow. 💸💡

**FinFlow & Idea Space** adalah *SaaS Boilerplate* ringan dan canggih berbasis **Next.js 16 (App Router)** yang berfungsi sebagai Dasbor Keuangan Terpusat untuk Rumah Tangga/Pribadi, dengan pintu masuk data (Data Entry) kilat dan asyik lewat **Telegram Bot**.

![PWA Mobile First](https://img.shields.io/badge/UX-Mobile--First-emerald?style=flat-square) ![Drizzle ORM](https://img.shields.io/badge/Database-Supabase%20%2B%20Drizzle-blue?style=flat-square)

## Fitur Utama
1. **Pencatatan Secepat Chatting:** Tak perlu lagi repot buka browser dan mengisi formulir panjang. Cukup tegur Telegram Bot Anda secara rileks (`"gaji 50000"` atau gunakan Menu Interaktif yang dipandu bot secara bertahap).
2. **Koneksi Suami & Istri (Shared Wallet):** Dompet keuangan dirajut berdasarkan *Chat ID* Telegram. Cukup undang *FinFlow Bot* ke dalam **Grup Keluarga Telegram** Anda. Apapun yang dicatat oleh Istri maupun Suami di dalam grup tersebut, akan masuk ke 1 kantong dan tampilan dasbor yang sama!
3. **Rekapitulasi Layar Lebar:** Lihat semua grafik perbandingan, papan aktivitas, serta kanvas Ide & Rencana lewat UI Dasbor Web (TailwindCSS Glassmorphism Ciamik).

## Persiapan Instalasi
1. Lakukan kloning pada repositori ini: `git clone https://github.com/bamk29/FinFlow.git`
2. Pasang modul dependensi Node.js `npm install`
3. Buat file konfigutasi `.env.local` 
   ```env
   # Format Koneksi Drizzle ke Database Anda
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

   # Hubungkan ke Bot Telegram Anda (dari @BotFather)
   TELEGRAM_BOT_TOKEN="token_anda"

   # Password Dasbor Web Anda
   WEB_PASSWORD="rahasiaistrisuami"
   ```
4. **Push Tabel Drizzle:** Lakukan penyusunan tabel database lewat Drizzle Migration `npm run db:push`
5. **Nyalakan Telegram FSM (Mode Polling Lokal):** Menangkap chat di HP untuk langsung bereaksi ke database 
   `npx tsx bot-local.ts`
6. **Nyalakan Web:**
   `npm run dev`

Buka browser di `http://localhost:3000/`. Jangan lupa bawa teh hangat saat ngecek pemasukan yang masuk! 🚀

---
*Dibangun di bawah kerangka eksperimen Next.js App Router dan API modern AI Agent.*

import * as dotenv from 'dotenv';
import { db } from './src/lib/db';
import { ideas, transactions, users, wallets } from './src/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

// Setup FSM untuk User Telegram. Tambahan state untuk "Tagihan/Iuran"
const userStates: Record<string, { step: string; type?: 'in' | 'out'; amount?: string; title?: string; planCat?: string }> = {};

function getKeyboardMenu() {
  return {
    keyboard: [
      [{ text: "🟢 Catat Pemasukan" }, { text: "🔴 Catat Pengeluaran" }],
      [{ text: "🗓️ Catat Tagihan/Iuran" }, { text: "📌 Cek Saldo & Tagihan" }],
      [{ text: "❌ Batalkan Interaksi" }]
    ],
    resize_keyboard: true
  };
}

async function sendMessage(chatId: string, text: string, replyMarkup?: any) {
  const payload: any = { chat_id: chatId, text };
  if (replyMarkup) payload.reply_markup = JSON.stringify(replyMarkup);

  try {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) console.error("Telegram API Error:", await res.text());
  } catch (error) {
    console.error("Gagal mengirim pesan Telegram", error);
  }
}

function parseMessage(text: string) {
  const t = text.toLowerCase();
  if (t.startsWith('ide:') || t.includes('#ide') || t.includes('#rencana')) {
    return { type: 'idea', title: text.replace(/ide:|#ide|#rencana/ig, '').trim() };
  }

  const isIncome = t.includes('#masuk') || t.includes('#income') || t.includes('gaji') || t.includes('bonus') || t.includes('profit');
  const amountMatch = t.match(/\d+(\.\d+)?/);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

  if (amount !== null && amountMatch !== null) {
    const title = text
      .replace(amountMatch[0], '')
      .replace(/#masuk|#keluar|#income|#expense|#pemasukan|#pengeluaran/ig, '')
      .trim();

    return { 
      type: 'transaction', 
      title: title || 'Transaksi Tanpa Nama',
      amount, 
      transactionType: isIncome ? 'in' : 'out',
      customTag: isIncome ? '#masuk' : '#keluar'
    };
  }

  return { type: 'unknown', text };
}

async function handleUpdate(update: any) {
  if (!update.message || !update.message.text) return;

  const msg = update.message;
  const chatId = msg.chat.id.toString();
  const textDesc = msg.text;
  const t = textDesc.toLowerCase();

  try {
    let userRecords = await db.select().from(users).where(eq(users.telegramId, chatId)).limit(1);
    let currentUser;
    
    if (userRecords.length === 0) {
      const [newWallet] = await db.insert(wallets).values({ name: `Wallet ${msg.chat.first_name || 'Shared'}` }).returning();
      const [newUser] = await db.insert(users).values({ telegramId: chatId, name: msg.chat.first_name || 'User', walletId: newWallet.id }).returning();
      currentUser = newUser;
      
      await sendMessage(chatId, `🎉 Halo! Dompet pribadi Anda berhasil dibuat. Coba klik menu di bawah untuk mencatat!`, getKeyboardMenu());
      return;
    } else {
      currentUser = userRecords[0];
    }

    if (t === '❌ batalkan interaksi' || t === '/cancel') {
      delete userStates[chatId];
      await sendMessage(chatId, "Interaksi dibatalkan. Kembali ke menu utama.", getKeyboardMenu());
      return;
    }

    if (t === '/start' || t === '/menu' || t === 'hi' || t === 'halo' || t === 'hai' || t === 'hello') {
      delete userStates[chatId];
      await sendMessage(chatId, "📊 Silakan gunakan tombol di bawah untuk mengelola keuangan rumah tangga Anda:", getKeyboardMenu());
      return;
    }

    // STATE MENU: Pengecekan Saldo & Tagihan Mendatang
    if (t === '📌 cek saldo & tagihan') {
      delete userStates[chatId];
      const inRes = await db.select({ total: sql<number>`sum(amount)` }).from(transactions).where(sql`type = 'in' AND wallet_id = ${currentUser.walletId}`);
      const outRes = await db.select({ total: sql<number>`sum(amount)` }).from(transactions).where(sql`type = 'out' AND wallet_id = ${currentUser.walletId}`);
      const balance = (Number(inRes[0]?.total) || 0) - (Number(outRes[0]?.total) || 0);
      
      const allIdeas = await db.select().from(ideas).where(eq(ideas.walletId, currentUser.walletId));
      const billsDues = allIdeas.filter(i => (i.description || '').includes('Tagihan') || (i.description || '').includes('Iuran'));
      
      let tagihanList = billsDues.length > 0 
        ? billsDues.map((item, idx) => `${idx+1}. ${item.title} -> ${item.description?.split('|')[1]?.trim() || 'Biaya belum diset'}`).join('\n')
        : "✅ Wah, Semua tagihan dan kewajiban bulan ini sudah beres! Hebat!";

      await sendMessage(chatId, `📌 **Info Keuangan Saat Ini**\nTotal Uang Anda: *Rp ${balance.toLocaleString('id-ID')}*\n\n📜 **Tanggungan/Tagihan Ke Depan:**\n${tagihanList}`, getKeyboardMenu());
      return;
    }

    if (t === '🟢 catat pemasukan') {
       userStates[chatId] = { step: 'ASK_AMOUNT', type: 'in' };
       await sendMessage(chatId, "🟢 *Pemasukan*\nBerapa jumlah uang yang Anda terima? (Cukup ketik angkanya saja, misal: 250000)", { remove_keyboard: true });
       return;
    }
    if (t === '🔴 catat pengeluaran') {
       userStates[chatId] = { step: 'ASK_AMOUNT', type: 'out' };
       await sendMessage(chatId, "🔴 *Pengeluaran*\nBerapa jumlah uang yang Anda belanjakan? (Ketik angkanya saja, misal: 50000)", { remove_keyboard: true });
       return;
    }
    // ALUR BARU: MENU RENCANA/TAGIHAN
    if (t === '🗓️ catat tagihan/iuran') {
       userStates[chatId] = { step: 'ASK_PLAN_CAT' };
       await sendMessage(chatId, "🗓️ *Tambah Rencana/Tagihan*\nTermasuk Kategori Apakah ini?\n\nKetik salah satu:\n1. *Tagihan*\n2. *Iuran*\n3. *Belanja*", { remove_keyboard: true });
       return;
    }

    const state = userStates[chatId];
    
    if (state) {
       // Kategori Transaksi Uang (Mode 2 Step Interaksi)
       if (state.step === 'ASK_AMOUNT') {
          const matchNum = t.match(/\d+(\.\d+)?/);
          if (!matchNum) {
             await sendMessage(chatId, "Angka tidak terdeteksi! Harap cantumkan nominal yang valid (contoh: 25000).");
             return;
          }
          state.amount = matchNum[0];
          state.step = 'ASK_DESC';
          await sendMessage(chatId, `Nominal: *Rp ${parseFloat(state.amount || '0').toLocaleString('id-ID')}*\n\nUntuk keterangan persisnya apa? (Misal: Makan sate, Gaji bulanan, Bensin)`);
          return;
       }

       if (state.step === 'ASK_DESC') {
          state.title = textDesc;
          await db.insert(transactions).values({
            walletId: currentUser.walletId, createdBy: currentUser.id, amount: state.amount!, type: state.type as Extract<typeof transactions.$inferInsert.type, string>, category: 'Umum', title: state.title
          } as any);

          delete userStates[chatId];
          await sendMessage(chatId, `💥 *Selesai Dicatat!*\nJenis: ${state.type === 'in' ? '🟢 Pemasukan' : '🔴 Pengeluaran'}\nKet: ${state.title}\nNilai: Rp ${parseFloat(state.amount || '0').toLocaleString('id-ID')}`, getKeyboardMenu());
          return;
       }

       // Kategori Rencana (Mode 3 Step Interaksi)
       if (state.step === 'ASK_PLAN_CAT') {
          if (t.includes('tagihan') || t === '1') state.planCat = 'Tagihan';
          else if (t.includes('iuran') || t === '2') state.planCat = 'Iuran';
          else state.planCat = 'Belanja';

          state.step = 'ASK_PLAN_AMOUNT';
          await sendMessage(chatId, `Kategori: *${state.planCat}*\n\nBerapa perkiraan/nominal uang yang harus disiapkan? (Ketik angkanya, atau ketik '0' jika belum tahu nominalnya)`);
          return;
       }

       if (state.step === 'ASK_PLAN_AMOUNT') {
          const matchNum = t.match(/\d+(\.\d+)?/);
          state.amount = matchNum ? matchNum[0] : '0';

          state.step = 'ASK_PLAN_DESC';
          await sendMessage(chatId, `Perkiraan Uang: Rp ${parseFloat(state.amount || '0').toLocaleString('id-ID')}\n\nMasukkan Nama / Judul Tagihannya: (Misalnya: SPP Bulan April, Rekening Air)`);
          return;
       }

       if (state.step === 'ASK_PLAN_DESC') {
          const amountFmt = state.amount !== '0' ? `Rp ${parseFloat(state.amount!).toLocaleString('id-ID')}` : 'Belum Ditentukan';
          const description = `Kategori: ${state.planCat} | Perkiraan Dana: ${amountFmt}`;
          
          await db.insert(ideas).values({
            walletId: currentUser.walletId, title: textDesc, description, status: 'Idea'
          } as any);

          delete userStates[chatId];
          await sendMessage(chatId, `✅ *Diingatkan!*\nTagihan/Rencana "${textDesc}" sudah masuk daftar antrean buku catatan.`, getKeyboardMenu());
          return;
       }
    }

    const parsed = parseMessage(textDesc);
    if (parsed.type === 'transaction') {
      await db.insert(transactions).values({
        walletId: currentUser.walletId, createdBy: currentUser.id, amount: parsed.amount!.toString(), type: parsed.transactionType as 'in'|'out', category: 'Umum', title: parsed.title, customTag: parsed.customTag
      } as any);
      await sendMessage(chatId, `✅ Catat Cepat Berhasil!\nJenis: ${parsed.transactionType === 'in' ? 'Pemasukan 🟢' : 'Pengeluaran 🔴'}\nKet: ${parsed.title}\nNominal: Rp ${(parsed.amount || 0).toLocaleString('id-ID')}`, getKeyboardMenu());
    } else if (parsed.type === 'idea') {
      await db.insert(ideas).values({ walletId: currentUser.walletId, createdBy: currentUser.id, title: parsed.title, description: 'via Bot Fast Parse', status: 'Idea' } as any);
      await sendMessage(chatId, `💡 Ide "${parsed.title}" diamankan!`, getKeyboardMenu());
    } else {
      await sendMessage(chatId, "Hmm, saya kurang paham. Gunakan tombol Menu Bantuan di bawah saja ya Bu/Pak! 😊", getKeyboardMenu());
    }

  } catch (err: any) {
    console.error("Error Processing Message:", err);
    await sendMessage(chatId, "❌ Terjadi kesalahan pada server saat memproses data.", getKeyboardMenu());
  }
}

async function startPolling() {
  let offset = 0;
  console.log("🚀 Memulai Telegram Bot Polling Lokal...");
  console.log("Kirim pesan ke bot Anda di Telegram untuk mencoba!");
  
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`);
      const data: any = await res.json();
      
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          await handleUpdate(update);
          offset = update.update_id + 1;
        }
      }
    } catch (err) {
      console.error("Gagal melakukan polling...", err);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

startPolling();

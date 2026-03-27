import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'FinFlow & Idea Space',
  description: 'Pencatat Keuangan modern & ide manajemen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

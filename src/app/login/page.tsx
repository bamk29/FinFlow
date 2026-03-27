'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = '/'; // Redirect agar middleware memperbarui state baru
      } else {
        const data = await res.json();
        setError(data.error || 'Password salah');
      }
    } catch {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-primary/10 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
            FinFlow Web
          </CardTitle>
          <CardDescription>
            Masukkan password ruang keluarga Anda untuk mengakses dasbor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password rahasia..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-center tracking-widest"
              />
            </div>
            {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Membuka Kunci...' : 'Masuk Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

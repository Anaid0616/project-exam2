'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, API } from '@/lib/api';

type LoginResponse = {
  data: { accessToken: string };
  meta?: unknown;
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { email, password };
      const { data } = await api<LoginResponse>(API.login, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.setItem('token', data.accessToken);
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Log in</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@stud.noroff.no"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="input"
            type="password"
            placeholder="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <p className="mt-6 text-sm">
        No account?{' '}
        <Link href="/auth/register" className="text-aegean underline">
          Register here
        </Link>
      </p>
      <p className="mt-2 text-sm">
        <Link href="/" className="text-aegean underline">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}

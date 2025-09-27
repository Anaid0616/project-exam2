'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, API, ApiError } from '@/lib/api';
import { loginSchema, type LoginForm } from '@/validation/auth';
import { toast } from '@/lib/toast';

const HERO =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=70&auto=format&fit=crop';

type LoginResponse =
  | { data: { accessToken: string } }
  | { accessToken: string };

function extractAccessToken(res: unknown): string | null {
  if (typeof res !== 'object' || res === null) return null;
  const r = res as Record<string, unknown>;
  const data = r['data'];
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>;
    if (typeof d['accessToken'] === 'string') return d['accessToken'];
  }
  if (typeof r['accessToken'] === 'string') return r['accessToken'];
  return null;
}

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  async function onSubmit(values: LoginForm) {
    setApiError(null);
    try {
      const res = await api<LoginResponse>(API.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const token = extractAccessToken(res);
      if (!token) throw new Error('No access token returned');

      localStorage.setItem('token', token);
      toast.success({ title: 'Welcome back!' });
      window.location.href = '/';
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Login failed';
      setApiError(msg);
      toast.error({ title: 'Login failed', description: msg });
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-2 md:px-6">
      {/* Bleed hero */}
      <section className="bleed relative h-[250px] md:h-[290px] z-0">
        <Image src={HERO} alt="" fill priority className="object-cover" />
      </section>

      {/* Card that overlaps the hero */}
      <div className="card relative mx-auto -mt-24 md:-mt-20 max-w-md z-10">
        <section className="p-6">
          <h1 className="text-2xl font-bold">Login</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
            noValidate
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@stud.noroff.no"
                aria-invalid={!!errors.email || undefined}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                className="input"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password || undefined}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>

            {apiError && (
              <p className="text-red-600 text-sm mt-2">{apiError}</p>
            )}
          </form>

          <p className="mt-6 text-sm">
            No account?{' '}
            <Link href="/auth/register" className="text-aegean underline">
              Register here
            </Link>
          </p>

          <p className="mt-2 text-sm">
            <Link
              href="/"
              className="inline-flex mt-1 items-center gap-1 text-ink/70 hover:text-aegean hover:underline"
            >
              <span aria-hidden>←</span> Back to home
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

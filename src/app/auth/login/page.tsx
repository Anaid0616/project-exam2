'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { publicApi, API, HttpError } from '@/lib/api';
import { loginSchema, type LoginForm } from '@/validation/auth';
import { toast } from '@/lib/toast';

const HERO =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=70&auto=format&fit=crop';

/**
 * LoginResponse
 * The Noroff API sometimes returns `{ data: { accessToken } }` or `{ accessToken }`.
 */
type LoginResponse =
  | { data: { accessToken: string } }
  | { accessToken: string };

/**
 * Extracts an access token from the API response,
 * regardless of whether it is wrapped in a `data` object.
 */
function extractAccessToken(res: unknown): string | null {
  if (typeof res !== 'object' || res === null) return null;
  const obj = res as Record<string, unknown>;
  const data = obj['data'];
  if (typeof data === 'object' && data !== null) {
    const inner = data as Record<string, unknown>;
    if (typeof inner['accessToken'] === 'string') return inner['accessToken'];
  }
  if (typeof obj['accessToken'] === 'string') return obj['accessToken'];
  return null;
}

/**
 * LoginPage
 *
 * - Proper label ↔ input association (htmlFor/id)
 * - Error messages linked via aria-describedby
 * - Polite aria-live region for async feedback
 */
export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const statusRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  /**
   * Submits login credentials to the Noroff API.
   * Saves token locally and redirects to home on success.
   */
  async function onSubmit(values: LoginForm) {
    setApiError(null);
    setStatusMsg('Signing in…');
    try {
      const res = await publicApi<LoginResponse>(API.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const token = extractAccessToken(res);
      if (!token) throw new Error('No access token returned');

      localStorage.setItem('token', token);
      setStatusMsg('Signed in. Redirecting…');
      requestAnimationFrame(() => statusRef.current?.focus());
      window.location.href = '/profile';
    } catch (err) {
      const msg =
        err instanceof HttpError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Login failed';

      setApiError(msg);
      setStatusMsg('Login failed.');
      requestAnimationFrame(() => statusRef.current?.focus());
      toast.error({ title: 'Login failed', description: msg });
    }
  }

  const ids = {
    email: 'login-email',
    emailErr: 'login-email-error',
    password: 'login-password',
    passwordErr: 'login-password-error',
  };

  return (
    <main className="mx-auto max-w-6xl px-2 md:px-6">
      {/* Hero Image */}
      <section className="bleed relative h-[250px] md:h-[290px] z-0">
        <Image src={HERO} alt="" fill priority className="object-cover" />
      </section>

      {/* Login Card */}
      <div className="card relative mx-auto -mt-24 md:-mt-20 max-w-md z-10">
        <section className="p-6">
          <h1 className="text-2xl font-bold">Login</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
            noValidate
          >
            {/* Email */}
            <div>
              <label
                htmlFor={ids.email}
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id={ids.email}
                className="input"
                type="email"
                placeholder="you@stud.noroff.no"
                aria-invalid={!!errors.email || undefined}
                aria-describedby={errors.email ? ids.emailErr : undefined}
                inputMode="email"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p
                  id={ids.emailErr}
                  className="text-red-600 text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor={ids.password}
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id={ids.password}
                className="input"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password || undefined}
                aria-describedby={errors.password ? ids.passwordErr : undefined}
                {...register('password')}
              />
              {errors.password && (
                <p
                  id={ids.passwordErr}
                  className="text-red-600 text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-label={isSubmitting ? 'Signing in…' : 'Sign in'}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>

            {apiError && (
              <p
                className="text-red-600 text-sm mt-2"
                role="status"
                aria-live="polite"
              >
                {apiError}
              </p>
            )}

            {/* Polite live region for async feedback */}
            <p
              ref={statusRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="text-sm text-ink/70"
            >
              {statusMsg}
            </p>
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

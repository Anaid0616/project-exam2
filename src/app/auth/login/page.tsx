'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, API } from '@/lib/api';
import { loginSchema, type LoginForm } from '@/validation/auth';

/** Expected shape coming from your API. Adjust if needed. */
type LoginResponse = {
  data: { accessToken: string };
  meta?: unknown;
};

/** Turns an unknown error into a human-friendly message. */
function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Login failed';
}

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);

  // RHF with Yup
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
   * Submits validated values to the login endpoint.
   * Saves token and redirects.
   */
  async function onSubmit(values: LoginForm) {
    setApiError(null);
    try {
      const res = await api<LoginResponse>(API.login, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      localStorage.setItem('token', res.data.accessToken);
      window.location.href = '/';
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Log in</h1>

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
          <label className="block text-sm font-medium">Password</label>
          <input
            className="input"
            type="password"
            placeholder="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password || undefined}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}
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

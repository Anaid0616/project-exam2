'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { publicApi, API, HttpError } from '@/lib/api';
import { registerSchema, type RegisterForm } from '@/validation/auth';
import { toast } from '@/lib/toast';

const HERO =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=70&auto=format&fit=crop';

/**
 * Response returned by the Noroff registration endpoint.
 */
type RegisterResponse = {
  data: {
    name: string;
    email: string;
    venueManager?: boolean;
    bio?: string | null;
    avatar?: { url: string; alt?: string | null };
    banner?: { url: string; alt?: string | null };
  };
};

/**
 * Registration Page
 *
 * - React Hook Form + Yup validation
 * - Proper label ↔ input association (htmlFor/id)
 * - Error messages linked via aria-describedby
 * - Polite aria-live status for async feedback
 */
export default function RegisterPage() {
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState('');
  const statusRef = React.useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      venueManager: false,
    },
    mode: 'onTouched',
  });

  /**
   * Submits registration details to the API.
   * Redirects to /auth/login on success.
   */
  async function onSubmit(values: RegisterForm) {
    setApiError(null);
    setStatusMsg('Registering…');
    try {
      const res = await publicApi<RegisterResponse>(API.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res?.data?.email) {
        setStatusMsg('Registered. Redirecting to login…');
        requestAnimationFrame(() => statusRef.current?.focus());
        window.location.href = '/auth/login';
      }
    } catch (err) {
      const msg =
        err instanceof HttpError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Registration failed';
      setApiError(msg);
      setStatusMsg('Registration failed.');
      requestAnimationFrame(() => statusRef.current?.focus());
      toast.error({ title: 'Register failed', description: msg });
    }
  }

  // Stable IDs for labels and error texts
  const ids = {
    name: 'reg-name',
    nameErr: 'reg-name-error',
    email: 'reg-email',
    emailErr: 'reg-email-error',
    password: 'reg-password',
    passwordErr: 'reg-password-error',
    venueManager: 'venueManager',
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="grid md:grid-cols-2 items-stretch">
        {/* Left: Registration form */}
        <section className="panel flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create an account</h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
              noValidate
            >
              {/* Name */}
              <div>
                <label
                  htmlFor={ids.name}
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  id={ids.name}
                  className="input"
                  type="text"
                  placeholder="Your name"
                  {...register('name')}
                  aria-invalid={!!errors.name || undefined}
                  aria-describedby={errors.name ? ids.nameErr : undefined}
                  autoComplete="name"
                />
                {errors.name && (
                  <p
                    id={ids.nameErr}
                    className="text-red-600 text-sm"
                    role="status"
                    aria-live="polite"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  autoComplete="email"
                  {...register('email')}
                  aria-invalid={!!errors.email || undefined}
                  aria-describedby={errors.email ? ids.emailErr : undefined}
                  inputMode="email"
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
                  placeholder="Password (min 8 characters)"
                  autoComplete="new-password"
                  {...register('password')}
                  aria-invalid={!!errors.password || undefined}
                  aria-describedby={
                    errors.password ? ids.passwordErr : undefined
                  }
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

              {/* Venue Manager toggle */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  id={ids.venueManager}
                  type="checkbox"
                  {...register('venueManager')}
                  className="h-4 w-4 accent-aegean focus:ring-0"
                />
                <label
                  htmlFor={ids.venueManager}
                  className="text-sm cursor-pointer select-none"
                >
                  Venue Manager
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={isSubmitting}
                aria-busy={isSubmitting || undefined}
                aria-label={isSubmitting ? 'Registering…' : 'Register'}
              >
                {isSubmitting ? 'Registering…' : 'Register'}
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

              {/* Polite live region for async status */}
              <p
                ref={statusRef}
                tabIndex={-1}
                className="text-sm text-ink/70"
                role="status"
                aria-live="polite"
              >
                {statusMsg}
              </p>
            </form>
          </div>

          <p className="mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-aegean underline">
              Login
            </Link>
          </p>
        </section>

        {/* Right: Image */}
        <div className="relative hidden md:block">
          <Image
            src={HERO}
            alt="Coastal landscape"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="rounded-app object-cover"
            unoptimized
          />
        </div>
      </div>
    </main>
  );
}

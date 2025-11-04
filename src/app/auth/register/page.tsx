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
 * - Uses React Hook Form + Yup for client-side validation.
 * - Submits via `publicApi` (safe fetch wrapper).
 * - Allows toggling "Venue Manager" role only.
 * - Displays inline validation errors and one toast if registration fails.
 */
export default function RegisterPage() {
  const [apiError, setApiError] = React.useState<string | null>(null);

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

    try {
      const res = await publicApi<RegisterResponse>(API.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res?.data?.email) {
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
      toast.error({ title: 'Register failed', description: msg });
    }
  }

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
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Your name"
                  {...register('name')}
                  aria-invalid={!!errors.name || undefined}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@stud.noroff.no"
                  autoComplete="email"
                  {...register('email')}
                  aria-invalid={!!errors.email || undefined}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Password (min 8 characters)"
                  autoComplete="new-password"
                  {...register('password')}
                  aria-invalid={!!errors.password || undefined}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Venue Manager toggle */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  id="venueManager"
                  type="checkbox"
                  {...register('venueManager')}
                  className="h-4 w-4 accent-aegean focus:ring-0"
                />
                <label
                  htmlFor="venueManager"
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
              >
                {isSubmitting ? 'Registering…' : 'Register'}
              </button>

              {apiError && (
                <p className="text-red-600 text-sm mt-2">{apiError}</p>
              )}
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

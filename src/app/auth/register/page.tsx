'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, API } from '@/lib/api';
import { registerSchema, type RegisterForm } from '@/validation/auth';
import { toast } from '@/lib/toast';
import { ApiError } from '@/lib/api';

const HERO =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=70&auto=format&fit=crop';

/** API response shape returned by the register endpoint. Adjust if your backend differs. */
type RegisterResponse = {
  data: {
    name: string;
    email: string;
    venueManager?: boolean;
    bio?: string | null;
    avatar?: { url: string; alt?: string | null };
    banner?: { url: string; alt?: string | null };
  };
  meta?: unknown;
};

/**
 * Registration page
 *
 * - Uses React Hook Form + Yup resolver for client validation.
 * - Submits to `API.register` via the `api` helper.
 * - On success, navigates to `/auth/login`.
 * - Field errors are shown under each input; API error is shown under the submit button.
 */
export default function RegisterPage() {
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<RegisterResponse | null>(null);

  // React Hook Form with Yup schema
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
   * Submit validated values to the register endpoint.
   * Shows the API response and redirects to login on success.
   */
  async function onSubmit(values: RegisterForm) {
    setApiError(null);
    setResult(null);
    try {
      const data = await api<RegisterResponse>(API.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      setResult(data);
      toast.success({ title: 'Account created' });

      if (data?.data?.email) {
        window.location.href = '/auth/login';
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Registration failed';

      setApiError(msg);
      toast.error({ title: 'Register failed', description: msg });
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="grid md:grid-cols-2 items-stretch">
        {/* Left: Card with the form */}
        <section className="panel flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">Register</h1>

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
                  placeholder="Name"
                  aria-invalid={!!errors.name || undefined}
                  {...register('name')}
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
                  placeholder="Email address"
                  autoComplete="email"
                  aria-invalid={!!errors.email || undefined}
                  {...register('email')}
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
                  placeholder="Password (min 8 chars)"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password || undefined}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Account type (radio) */}
              <fieldset className="mt-2">
                <legend
                  id="legend-account-type"
                  className="text-sm font-medium mb-2"
                >
                  Account type
                </legend>

                {/* fieldset+legend gives the group semantics; keep labels clickable */}
                <div
                  className="flex gap-6"
                  aria-labelledby="legend-account-type"
                >
                  <label
                    htmlFor="acct-customer"
                    className="inline-flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      id="acct-customer"
                      type="radio"
                      value="false"
                      {...register('venueManager', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="
                        h-4 w-4 accent-aegean
                        outline-none focus:outline-none focus:ring-0
                        focus-visible:outline-none focus-visible:ring-0
                      "
                    />
                    Customer
                  </label>

                  <label
                    htmlFor="acct-manager"
                    className="inline-flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      id="acct-manager"
                      type="radio"
                      value="true"
                      {...register('venueManager', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="
                        h-4 w-4 accent-aegean
                        outline-none focus:outline-none focus:ring-0
                        focus-visible:outline-none focus-visible:ring-0
                      "
                    />
                    Venue Manager
                  </label>
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering…' : 'Register'}
              </button>

              {apiError && (
                <p className="text-red-600 text-sm mt-2">{apiError}</p>
              )}
              {result && (
                <pre className="mt-3 rounded-app bg-shell p-3 text-xs border">
                  {JSON.stringify(result, null, 2)}
                </pre>
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

        {/* Right: Big image */}
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

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api, API } from '@/lib/api';

const HERO =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=70&auto=format&fit=crop';

// Payload type API
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  venueManager?: boolean;
};

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
export default function RegisterPage() {
  // Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [venueManager, setVenueManager] = React.useState(false);

  // UX state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<RegisterResponse | null>(null);

  function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Registration failed';
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: RegisterPayload = { name, email, password, venueManager };
      const data = await api<RegisterResponse>(API.register, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setResult(data);

      if (data?.data?.email) window.location.href = '/auth/login';
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="grid gap-2 md:grid-cols-2 items-stretch">
        {/* Left: Card with the form */}
        <section className="panel flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">Register</h1>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
              </div>

              {/* Account type (radio) */}
              <fieldset className="mt-2">
                <legend
                  id="legend-account-type"
                  className="text-sm font-medium mb-2"
                >
                  Account type
                </legend>

                <div
                  className="flex gap-6"
                  role="radiogroup"
                  aria-labelledby="legend-account-type"
                >
                  <div className="inline-flex items-center gap-2">
                    <input
                      id="role-customer"
                      type="radio"
                      name="role"
                      value="customer"
                      checked={!venueManager}
                      onChange={() => setVenueManager(false)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="role-customer" className="select-none">
                      Customer
                    </label>
                  </div>

                  <div className="inline-flex items-center gap-2">
                    <input
                      id="role-manager"
                      type="radio"
                      name="role"
                      value="manager"
                      checked={venueManager}
                      onChange={() => setVenueManager(true)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="role-manager" className="select-none">
                      Venue Manager
                    </label>
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Registering…' : 'Register'}
              </button>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {result && (
                <pre className="mt-3 rounded-xl bg-shell p-3 text-xs border">
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
            className="rounded-2xl object-cover"
            unoptimized
          />
        </div>
      </div>
    </main>
  );
}

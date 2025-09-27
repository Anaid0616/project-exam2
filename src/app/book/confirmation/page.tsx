'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { one, int, type Sp } from '@/lib/url-params';

/** ConfirmParams
 * Expected query parameters for the booking confirmation page.
 * All fields are optional; validation is done in `parseConfirmParams()`.
 */
type ConfirmParams = {
  id?: string;
  venueName?: string;
  from?: string;
  to?: string;
  guests?: number;
  total?: number;
  location?: string;
};

/**
 * parseConfirmParams
 *
 * - Parses and validates the expected query parameters from the URL.
 * - Returns an object with the parsed values or undefined if missing/invalid.
 */
function parseConfirmParams(sp: Sp): ConfirmParams {
  return {
    id: one(sp.id),
    venueName: one(sp.venueName),
    from: one(sp.from),
    to: one(sp.to),
    guests: (() => {
      const v = one(sp.guests);
      return v ? int(v, 0) : undefined;
    })(),
    total: (() => {
      const v = one(sp.total);
      return v ? int(v, 0) : undefined;
    })(),
    location: one(sp.location),
  };
}

/**
 * BookContent (Client)
 * Renders the booking confirmation details using URL parameters.
 * Uses `useSearchParams()` to access query parameters.
 */
function BookContent() {
  const sp = useSearchParams();

  // Memoize raw params object from URLSearchParams
  const raw = React.useMemo<Sp>(() => Object.fromEntries(sp.entries()), [sp]);
  const params = React.useMemo(() => parseConfirmParams(raw), [raw]);

  const venueName = params.venueName ?? '—';
  const venueId = params.id;
  const from = params.from ?? '—';
  const to = params.to ?? '—';
  const guests = params.guests?.toString() ?? '—';
  const total = params.total != null ? params.total.toString() : undefined;
  const location = params.location ?? '—';

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="card p-5 text-center">
        <div className="mx-auto flex items-center justify-center gap-3">
          <Image
            src="/confirmcheck.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <h1 className="text-3xl font-semibold text-ink">
            Booking confirmed!
          </h1>
        </div>

        <p className="mt-2 text-xl font-medium text-ink/70">
          Your stay at{' '}
          <span className="font-semibold text-aegean">{venueName}</span> is
          confirmed.
        </p>
      </div>

      <div className="card p-5 text-center">
        <div className="mt-4 grid gap-1 text-sm text-ink/70">
          <p>
            <strong>Venue:</strong> {venueName}
          </p>
          <p>
            <strong>Dates:</strong> {from} → {to}
          </p>
          <p>
            <strong>Guests:</strong> {guests}
          </p>
          <p>
            <strong>Total:</strong> {total ?? '—'}
          </p>
          <p>
            <strong>Booking reference:</strong> {venueId ?? '—'}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
        </div>

        <div className="mt-4 text-xs text-ink/60">
          <p>Free cancellation up to 48h before arrival.</p>
          <p>You’ll also receive an email confirmation.</p>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Link href="/profile" className="btn btn-primary">
            View my bookings
          </Link>
          {venueId && (
            <Link href={`/venues/${venueId}`} className="btn btn-outline">
              Back to venue
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * BookConfirmationPage
 * Wrapper med Suspense så `useSearchParams()`
 */
export default function BookConfirmationPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading…</main>}>
      <BookContent />
    </Suspense>
  );
}

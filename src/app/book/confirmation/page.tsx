'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { one, int, type Sp } from '@/lib/url-params';
import { formatBookingDates } from '@/lib/date';
import { motion } from 'framer-motion';

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

  const guests = params.guests?.toString() ?? '—';
  const total = params.total != null ? params.total.toString() : undefined;
  const location = params.location ?? '—';

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="card p-5 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 8 }}
          className="mx-auto flex items-center justify-center gap-3"
        >
          <Image
            src="/confirmcheck.svg"
            alt="Checkmark"
            width={48}
            height={48}
            className="h-12 w-12"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl font-semibold text-ink mt-3"
        >
          Booking confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-2 text-xl font-medium text-ink/70"
        >
          Your stay at{' '}
          <span className="font-semibold text-aegean">{venueName}</span> is
          confirmed.
        </motion.p>
      </div>

      <div className="card p-5 text-center">
        <div className="mt-4 grid gap-1 text-sm text-ink/70">
          <p>
            <strong>Venue:</strong> {venueName}
          </p>
          <p>
            <strong>Dates:</strong>{' '}
            {formatBookingDates(params.from ?? '', params.to ?? '')}
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
          <Link href="/profile?tab=bookings" className="btn btn-primary">
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

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function BookConfirmationPage() {
  const sp = useSearchParams();

  const venueName = sp.get('venueName') ?? '—';
  const venueId = sp.get('id') ?? undefined;
  const from = sp.get('from') ?? '—';
  const to = sp.get('to') ?? '—';
  const guests = sp.get('guests') ?? '—';
  const total = sp.get('total');
  const location = sp.get('location') ?? '—';

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
            <strong>Total:</strong> {total ? ` for ${total} total` : '—'}
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

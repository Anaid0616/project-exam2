'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ApiBooking } from '@/features/bookings/api/bookings.api';

/**
 * Formats a number as currency in EUR (no decimals).
 *
 * @param n - The number to format.
 * @returns A localized currency string (e.g. "€80").
 */
function money(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

/** One day in milliseconds. */
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Converts a date string to UTC midnight.
 *
 * @param s - ISO date string (e.g. "2025-10-05").
 * @returns The UTC timestamp for midnight that day.
 */
function parseUtcMidnight(s: string) {
  const d = new Date(s);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Calculates the number of nights between two ISO date strings.
 *
 * @param a - Start date (ISO).
 * @param b - End date (ISO).
 * @returns Number of nights between the two dates.
 */
function nightsBetween(a: string, b: string) {
  const from = parseUtcMidnight(a);
  const to = parseUtcMidnight(b);
  const diff = Math.max(0, Math.round((to - from) / DAY_MS));
  return diff;
}

/**
 * Formats a date as a readable short string (e.g. "05 Oct 2025").
 *
 * @param s - ISO date string.
 * @returns Formatted date string.
 */
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * BookingDetailsCard
 *
 * Reusable presentation component for displaying detailed booking information.
 * Used by the booking details page and can be embedded elsewhere (e.g. profile overview).
 *
 * @param props.booking - The booking data returned from the API.
 */
export default function BookingDetailsCard({
  booking,
}: {
  booking: ApiBooking;
}) {
  const venue = booking.venue ?? {};
  const vName = venue.name ?? 'Venue';

  const cover =
    venue.media?.[0]?.url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';

  const nights = nightsBetween(booking.dateFrom, booking.dateTo);
  const price = Number(venue.price ?? 0);
  const total = price && nights ? price * nights : 0;

  const loc =
    venue.location &&
    [venue.location.city, venue.location.country].filter(Boolean).join(', ');

  return (
    <>
      {/* Header with venue image and link */}
      <div className="card p-4 flex items-center gap-4">
        <Image
          src={cover}
          alt={vName}
          width={120}
          height={80}
          className="rounded-app object-cover aspect-[3/2]"
          unoptimized
        />
        <div className="min-w-0">
          {venue.id ? (
            <Link href={`/venues/${venue.id}`} className="hover:underline">
              <h1 className="text-lg font-semibold truncate">{vName}</h1>
            </Link>
          ) : (
            <h1 className="text-lg font-semibold truncate">{vName}</h1>
          )}
          {loc && <p className="text-sm text-ink/70">{loc}</p>}
          <p className="text-sm text-ink/70">
            Booking ref: <strong>{booking.id}</strong>
          </p>
        </div>
      </div>

      {/* Booking details */}
      <section className="card p-5 space-y-3">
        <h2 className="font-semibold">Booking details</h2>

        <div className="grid gap-2 text-sm">
          <p>
            Dates:{' '}
            <span className="font-medium">{fmtDate(booking.dateFrom)}</span> →{' '}
            <span className="font-medium">{fmtDate(booking.dateTo)}</span> (
            {nights} night{nights !== 1 ? 's' : ''})
          </p>

          <p>Guests: {booking.guests}</p>

          <p>
            Price: {price ? `${money(price)} / night` : '—'} · Total:{' '}
            <span className="font-semibold">{total ? money(total) : '—'}</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/profile" className="btn btn-white">
            View my bookings
          </Link>
        </div>
      </section>
    </>
  );
}

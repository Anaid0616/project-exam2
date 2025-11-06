'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ApiBooking } from '@/features/bookings/api/bookings.api';
import { formatBookingDates, nightsBetween } from '@/lib/date';

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

/**
 * BookingDetailsCard
 *
 * Displays detailed information for a single booking.
 * - Shows venue name, location, image, and booking reference.
 * - Lists booking dates, guests, price per night, and total.
 * - Reuses centralized date utilities (`formatBookingDates`) to ensure
 *   consistent and timezone-safe date formatting across the app.
 *
 * @component
 * @example
 * ```tsx
 * <BookingDetailsCard booking={bookingData} />
 * ```
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

  // Provide a fallback image if the venue has none
  const cover =
    venue.media?.[0]?.url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';

  const price = Number(venue.price ?? 0);
  const nights = nightsBetween(booking.dateFrom, booking.dateTo);

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
          {/* Dates formatted in English using formatBookingDates */}
          <p>
            Dates:{' '}
            <span className="font-medium">
              {formatBookingDates(booking.dateFrom, booking.dateTo)}
            </span>
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

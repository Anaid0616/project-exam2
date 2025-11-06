'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CalendarRange, Users } from 'lucide-react';
import { money } from '@/lib/utils';
import { formatBookingDates } from '@/lib/date';
import type { BookingLite } from '@/types/booking';

/**
 * BookingCard
 *
 * Presentation component that displays a summary of a single booking.
 * Used primarily in the user's Profile → "My Bookings" tab.
 *
 * Features:
 * - Displays the venue image with a fallback placeholder if missing.
 * - Shows location, formatted date range, number of guests, and total price.
 * - Provides a "View booking" call-to-action linking to the detailed booking page.
 *
 * Accessibility:
 * - Icons are decorative and marked with `aria-hidden`.
 * - Text content is semantic and readable by screen readers.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {BookingLite} props.b - Booking data to render in the card.
 * @param {string} [props.className] - Optional CSS class for layout customization.
 */
export default function BookingCard({
  b,
  className = '',
}: {
  b: BookingLite;
  className?: string;
}) {
  /** Local state for image source, replaced with a placeholder on error. */
  const PLACEHOLDER = '/img/placeholder.jpg';
  const [imgSrc, setImgSrc] = React.useState(b.image || PLACEHOLDER);

  /** Derived formatted date string using shared date helpers. */
  const dateText =
    b.dateFrom && b.dateTo
      ? formatBookingDates(b.dateFrom, b.dateTo)
      : b.when ?? '—';

  return (
    <article className={`card p-3 ${className}`}>
      {/* --- Venue Image --- */}
      <div className="mb-3 overflow-hidden rounded-app">
        <div className="relative aspect-[16/9]">
          <Image
            src={imgSrc}
            alt={b.venueName}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            unoptimized
            onError={() => setImgSrc(PLACEHOLDER)}
          />
        </div>
      </div>

      {/* --- Venue Title --- */}
      <h4 className="truncate text-lg font-semibold leading-tight">
        {b.venueName}
      </h4>

      {/* --- Booking Details --- */}
      <ul className="mt-1 space-y-1 text-sm">
        {/* Location */}
        {b.location && (
          <li className="flex items-start gap-2">
            <MapPin className="mt-[2px] h-4 w-4 text-sunset" aria-hidden />
            <span className="truncate">{b.location}</span>
          </li>
        )}

        {/* Date Range */}
        <li className="flex items-start gap-2">
          <CalendarRange className="mt-[2px] h-4 w-4" aria-hidden />
          <span className="truncate">{dateText}</span>
        </li>

        {/* Guests */}
        {typeof b.guests === 'number' && (
          <li className="flex items-start gap-2">
            <Users className="mt-[2px] h-4 w-4" aria-hidden />
            <span>
              {b.guests} guest{b.guests === 1 ? '' : 's'}
            </span>
          </li>
        )}
      </ul>

      {/* --- Footer Section --- */}
      <div className="mt-3 flex">
        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
          <p className="font-semibold">
            {money(b.total)} <span className="font-normal">total</span>
          </p>
          <Link href={`/profile/bookings/${b.id}`} className="btn btn-primary">
            View booking
          </Link>
        </div>
      </div>
    </article>
  );
}

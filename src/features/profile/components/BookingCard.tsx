'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CalendarRange, Users } from 'lucide-react';
import { money } from '@/lib/utils';

/**
 * BookingLite
 * Minimal booking shape used by profile lists.
 * - `when`: preformatted date range (e.g. "2025-10-01 – 2025-10-04")
 * - `nights`: number of nights (used to append "· N nights")
 * - `location`: "City, Country"
 */
export type BookingLite = {
  id: string;
  venueId?: string;
  venueName: string;
  when: string;
  total: number; // EUR
  image?: string;
  location?: string;
  guests?: number;
  nights: number;
};

/**
 * BookingCard
 *
 * @param props Component props
 * @param props.b BookingLite data to render
 * @param props.className Optional className merged on the outer card
 */
export default function BookingCard({
  b,
  className = '',
}: {
  b: BookingLite;
  className?: string;
}) {
  const fallback =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';
  const src = b.image ?? fallback;

  return (
    <article className={`card p-3 ${className}`}>
      {/* Image */}
      <div className="mb-3 overflow-hidden rounded-app">
        <div className="relative aspect-[16/9]">
          <Image
            src={src}
            alt={b.venueName}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Title */}
      <h4 className="truncate text-lg font-semibold leading-tight">
        {b.venueName}
      </h4>

      {/* Details */}
      <ul className="mt-1 space-y-1">
        {b.location && (
          <li className="flex items-start gap-2">
            <MapPin className="mt-[2px] h-4 w-4 text-sunset" aria-hidden />
            <span className="truncate">{b.location}</span>
          </li>
        )}

        <li className="flex items-start gap-2">
          <CalendarRange className="mt-[2px] h-4 w-4" aria-hidden />
          <span className="truncate">
            {b.when}
            {b.nights > 0
              ? ` · ${b.nights} night${b.nights === 1 ? '' : 's'}`
              : ''}
          </span>
        </li>

        {typeof b.guests === 'number' && (
          <li className="flex items-start gap-2">
            <Users className="mt-[2px] h-4 w-4" aria-hidden />
            <span>
              {b.guests} guest{b.guests === 1 ? '' : 's'}
            </span>
          </li>
        )}
      </ul>

      {/* Footer: push right with ml-auto, keep together; wraps neatly on tiny screens */}
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

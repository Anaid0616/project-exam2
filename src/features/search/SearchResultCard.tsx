'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CalendarRange } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import Rating from '@/components/Rating';
import AmenitiesRow from '@/components/AmenitiesRow';
import type { VenueWithBookings } from '@/types/venue';

/**
 * SearchResultCard
 *
 * Responsive card used in the search results grid to preview a single venue.
 * Shows image, name, rating, location, a brief date row, amenities and a CTA.
 *
 * Layout:
 * - On small screens: single-column stacked layout.
 * - On md+ screens: two-column grid ([image | info]); image spans two rows.
 *
 * Accessibility:
 * - Decorative icons have `aria-hidden`.
 * - `Rating` component includes an ARIA label with the numeric value.
 *
 * @param param0 - Component props
 * @param param0.v - Venue data (incl. media, meta, price) to render in the card
 */
export default function SearchResultCard({ v }: { v: VenueWithBookings }) {
  /** Primary image URL (falls back to a generic icon if none exists). */
  const img =
    v.media && v.media[0] && v.media[0].url?.trim()
      ? v.media[0].url
      : '/placeholder.jpg';

  /** City and country labels with safe fallbacks. */
  const city = v.location?.city ?? '—';
  const country = v.location?.country ?? '—';
  /** Normalized numeric rating (defaults to 0 if missing). */
  const rating = typeof v.rating === 'number' ? v.rating : 0;

  return (
    <article className="relative isolate overflow-hidden rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Save (md+): top-right corner of the card, sunset tone */}
      <SaveButton
        venueId={v.id}
        variant="overlay"
        tone="sunset"
        size="md"
        className="absolute right-3 top-3 hidden md:block"
      />

      {/* Main grid: md+ two columns [image | info], image spans two rows */}
      <div className="grid grid-cols-1 gap-4 md:auto-rows-auto md:grid-cols-[270px,1fr] lg:grid-cols-[310px,1fr]">
        {/* Image (row 1–2 on md+) */}
        <div
          className="relative w-full overflow-hidden rounded-2xl md:row-span-2
                aspect-[16/9] md:aspect-[4/3] lg:aspect-[3/2]"
        >
          <Image
            src={img}
            alt={v.media?.[0]?.alt || v.name || 'Venue image'}
            fill
            sizes="(max-width: 768px) 100vw, 260px"
            className="object-cover"
          />

          {/* Save (mobile): on the image, white tone */}
          <SaveButton
            venueId={v.id}
            variant="overlay"
            tone="white"
            size="md"
            className="absolute right-2 top-2 md:hidden"
          />

          {/* Small chips over the image */}
          <div className="pointer-events-none absolute left-2 top-2 inline-flex gap-1 text-sm">
            <span className="rounded-full bg-white/80 px-2 py-0.5 font-medium text-ink/90 backdrop-blur">
              {v.maxGuests} guests
            </span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 font-medium text-ink/90 backdrop-blur">
              {country}
            </span>
          </div>
        </div>

        {/* Info (column 2, row 1) */}
        <div className="min-w-0">
          <h4 className="truncate text-lg font-semibold leading-tight text-ink">
            {v.name}
          </h4>

          {/* Rating just below the name */}
          <div className="mt-1">
            <Rating value={rating} size="md" variant="five" />
          </div>

          {/* Location below rating */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-ink/90">
            <MapPin className="h-4 w-4 text-sunset" aria-hidden />
            <span className="truncate">
              {city}, {country}
            </span>
          </div>

          {/* Date row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-ink/90">
            <CalendarRange className="h-4 w-4" aria-hidden />
            <span>Date from – Date to, 2 nights</span>
          </div>

          {/* Amenities  */}
          <div className="mt-2">
            <AmenitiesRow meta={v.meta ?? {}} size="sm" gapClass="gap-4" />
          </div>
        </div>

        {/* Footer (column 2, row 2): price/total on the left, CTA on the right */}
        <div className="border-t border-ink/10 pt-3 md:col-start-2 md:row-start-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <div className="font-semibold">€{v.price} / night</div>
              <div className="text-ink/90">
                €{v.price * v.maxGuests} · {v.maxGuests} guests
              </div>
            </div>

            <Link href={`/venues/${v.id}`} className="btn btn-primary">
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

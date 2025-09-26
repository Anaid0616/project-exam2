'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  CalendarRange,
  Wifi,
  Car,
  UtensilsCrossed,
  PawPrint,
  type LucideIcon,
} from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import type { VenueWithBookings } from '@/types/venue';

/**
 * Displays the rating using your brand icon instead of stars.
 * Filled vs. “empty” state is determined by rounding the numeric value.
 *
 * Accessibility: exposes the precise rating via `aria-label` while the icons
 * themselves are decorative and `aria-hidden`.
 *
 * @param props.value - Numeric rating in the range 0–5 (rounded for fill)
 */
function LogoRating({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div
      className="inline-flex items-center gap-1"
      aria-label={`${value.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'opacity-100' : 'opacity-30'}>
          <Image
            src="/logofooter.svg"
            alt="" // decorative
            width={16}
            height={16}
            className="inline-block align-[-2px]"
            aria-hidden
          />
        </span>
      ))}
      <span className="ml-1 text-[13px] text-ink/60">{value.toFixed(1)}</span>
    </div>
  );
}

/**
 * Single amenity line (icon + label). Renders nothing when `show` is false.
 *
 * @param props.show - Whether to render this amenity
 * @param props.icon - Lucide icon component for the amenity
 * @param props.label - Text label for the amenity
 */
function Amenity({
  show,
  icon: Icon,
  label,
}: {
  show: boolean;
  icon: LucideIcon;
  label: string;
}) {
  if (!show) return null;
  return (
    <li className="inline-flex items-center gap-1.5 text-sm text-ink/70">
      <Icon className="h-4 w-4 text-ink/50" aria-hidden />
      <span className="truncate">{label}</span>
    </li>
  );
}

/**
 * SearchResultCard
 *
 * Responsive card used on the search results page.
 *
 * Layout (md+):
 * - Two-column grid: [image | info].
 * - The image spans two rows (`md:row-span-2`).
 * - A footer row lives in column 2, row 2 (so it sits under the info column only).
 *
 * Interactions:
 * - SaveButton (heart) appears:
 *   - On mobile: white icon, positioned on top-right of the image.
 *   - On md+: sunset-colored icon, positioned in the card’s top-right corner.
 *
 * Accessibility:
 * - Rating announces the exact numeric rating via `aria-label`.
 * - Decorative icons are `aria-hidden`.
 *
 * @param props.v - Venue with optional bookings, typed from your shared `VenueWithBookings`
 */
export default function SearchResultCard({ v }: { v: VenueWithBookings }) {
  const img = v.media[0]?.url || '/icon.png';
  const city = v.location?.city ?? '—';
  const country = v.location?.country ?? '—';
  const rating = typeof v.rating === 'number' ? v.rating : 0;

  // Normalize amenity booleans for simple rendering logic
  const amen = {
    wifi: !!v.meta.wifi,
    parking: !!v.meta.parking,
    breakfast: !!v.meta.breakfast,
    pets: !!v.meta.pets,
  } as const;

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

      {/* Main grid:
         md+: two columns [image | info], image spans two rows. */}
      <div className="grid grid-cols-1 gap-4 md:auto-rows-auto md:grid-cols-[270px,1fr] lg:grid-cols-[310px,1fr]">
        {/* Image (row 1–2 on md+) */}
        <div
          className="relative w-full overflow-hidden rounded-2xl md:row-span-2
                aspect-[16/9] md:aspect-[4/3] lg:aspect-[3/2]"
        >
          <Image
            src={img}
            alt={v.media[0]?.alt ?? v.name}
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
          <div className="pointer-events-none absolute left-2 top-2 inline-flex gap-1">
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-ink/80 backdrop-blur">
              {v.maxGuests} guests
            </span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-ink/80 backdrop-blur">
              {country}
            </span>
          </div>
        </div>

        {/* Info (column 2, row 1) */}
        <div className="min-w-0">
          <h4 className="truncate text-[17px] font-semibold leading-tight text-ink">
            {v.name}
          </h4>

          {/* Rating just below the name */}
          <div className="mt-1">
            <LogoRating value={rating} />
          </div>

          {/* Location below rating */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink/70">
            <MapPin className="h-4 w-4 text-sunset" aria-hidden />
            <span className="truncate">
              {city}, {country}
            </span>
          </div>

          {/* Date row (placeholder copy) */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/70">
            <CalendarRange className="h-4 w-4" aria-hidden />
            <span>Date from – Date to, 2 nights</span>
          </div>

          {/* Amenities */}
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <Amenity show={amen.wifi} icon={Wifi} label="Wi-Fi" />
            <Amenity
              show={amen.breakfast}
              icon={UtensilsCrossed}
              label="Breakfast"
            />
            <Amenity show={amen.parking} icon={Car} label="Parking" />
            <Amenity show={amen.pets} icon={PawPrint} label="Pets" />
          </ul>
        </div>

        {/* Footer (column 2, row 2): price/total on the left, CTA on the right */}
        <div className="border-t border-ink/10 pt-3 md:col-start-2 md:row-start-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <div className="text-[15px] font-semibold text-ink">
                €{v.price} / night
              </div>
              <div className="text-sm text-ink/70">
                €{v.price * v.maxGuests} · {v.maxGuests} guests
              </div>
            </div>

            <Link
              href={`/venues/${v.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-aegean px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

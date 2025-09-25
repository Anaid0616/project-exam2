'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { VenueWithBookings } from '@/types/venue';

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div className="flex gap-0.5 text-aegean" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

export default function SearchResultCard({ v }: { v: VenueWithBookings }) {
  const img = v.media?.[0]?.url ?? '/icon.png';
  const city = v.location?.city ?? '—';
  const country = v.location?.country ?? '—';
  const rating = typeof v.rating === 'number' ? v.rating : 0;
  const maxGuests = v.maxGuests ?? 1;

  // Amenities
  const amen = {
    wifi: Boolean(v.meta?.wifi),
    parking: Boolean(v.meta?.parking),
    breakfast: Boolean(v.meta?.breakfast),
    pets: Boolean(v.meta?.pets),
  };

  return (
    <article className="card p-3">
      <div className="grid grid-cols-[160px,1fr,auto] gap-3">
        {/* Image */}
        <div className="relative h-28 w-full overflow-hidden rounded-app">
          <Image
            src={img}
            alt={v.media?.[0]?.alt ?? v.name}
            fill
            className="object-cover"
            sizes="160px"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold leading-tight truncate">{v.name}</h4>
            <button
              aria-label="Save"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-ink/5"
            >
              <Heart className="h-5 w-5 text-aegean" />
            </button>
          </div>

          <div className="mt-1 text-sm text-ink/70">
            {city}, {country}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
            <Stars value={rating} />
            <span>•</span>
            <span>Date from – Date to, 2 nights</span>
          </div>

          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
            {amen.wifi && <li>Wi-Fi</li>}
            {amen.breakfast && <li>Breakfast</li>}
            {amen.parking && <li>Parking</li>}
            {amen.pets && <li>Pets</li>}
          </ul>
        </div>

        {/* Price / CTA */}
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <div className="text-base font-semibold">€{v.price} / night</div>
            <div className="text-sm text-ink/70">
              €{v.price * maxGuests} · {maxGuests} guests
            </div>
          </div>

          <Link href={`/venues/${v.id}`} className="btn btn-primary btn-sm">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

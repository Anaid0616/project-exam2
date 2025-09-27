import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { getVenueWithBookings } from '@/lib/venuescrud';
import type { VenueWithBookings, BookedLite } from '@/types/venue';

import HeroCarousel from './_components/HeroCarousel';
import BookingPanel from './_components/BookingPanel';
import OwnerActions from './_components/OwnerActions';

import Rating from '@/components/Rating';
import AmenitiesRow from '@/components/AmenitiesRow';

export const revalidate = 0;

/**
 * Format a number as EUR with no decimals (e.g. "€240").
 * @param n Nightly price in EUR.
 * @returns Formatted currency string.
 */
function money(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Venue details page.
 *
 * Server-rendered page that:
 *  - Fetches a venue (incl. bookings and owner).
 *  - Renders hero images, title, rating, location, description, amenities,
 *    policies, map, and the booking panel (client side).
 *
 * Layout:
 *  - ≥900px: 2-column grid with a sticky booking panel (360px).
 *  - <900px: single column; booking panel sits under the content.
 *
 * @param params Dynamic route params for /venues/[id].
 */
export default async function VenueDetailsPage({
  params,
}: {
  /** Dynamic segment from /venues/[id] (kept as a Promise per your setup). */
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const v: VenueWithBookings = await getVenueWithBookings(id);

  const heroFallback = {
    url:
      v.media?.[0]?.url ??
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60&auto=format&fit=crop',
    alt: v.media?.[0]?.alt ?? v.name ?? 'Venue',
  };

  const loc =
    v.location &&
    [v.location.city, v.location.country].filter(Boolean).join(', ');

  const booked: BookedLite[] = v.bookings ?? [];

  return (
    <>
      <div className="mx-auto max-w-7xl px-2 md:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-2 pt-3 text-xs text-ink/70">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/#venues" className="hover:underline">
                Venues
              </Link>
            </li>
            <li>/</li>
            <li className="truncate">{v.name}</li>
          </ol>
        </nav>

        <HeroCarousel
          images={v.media}
          fallback={heroFallback}
          height={520}
          fullBleed={false}
          venueId={v.id}
          showFavorite
        />
      </div>

      <main className="relative z-0 -mt-10 md:-mt-14 mx-auto max-w-6xl px-2 md:px-6">
        <section className="grid gap-6 min-[900px]:grid-cols-[1fr,360px] items-start">
          {/* Content */}
          <div className="card p-5 space-y-5">
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {v.name}
                </h1>
                <Rating
                  value={v.rating ?? 0}
                  size="lg"
                  className="translate-y-[1px]"
                />
              </div>

              <div className="mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-sunset" aria-hidden />
                {loc && <p className="mt-1 text-ink/70">{loc}</p>}
              </div>

              <p className="mt-2 text-ink/70">
                Guests: up to {v.maxGuests}
                {typeof v.price === 'number' && (
                  <> &nbsp;•&nbsp; {money(v.price)} / night</>
                )}
              </p>
            </div>

            <OwnerActions venueId={v.id} ownerName={v.owner?.name} />

            <hr className="border-ink/10" />

            <div>
              <h2 className="text-base font-semibold">Description</h2>
              <p className="mt-2 text-ink/80">
                {v.description ?? 'No description provided.'}
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold">Amenities</h3>
              <div className="mt-2">
                <AmenitiesRow meta={v.meta ?? {}} size="md" gapClass="gap-6" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">Policies</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink/80">
                <li>Check-in after 15:00</li>
                <li>Free cancellation up to 48 hours before arrival</li>
                <li>No smoking indoors</li>
              </ul>
            </div>

            {loc && (
              <div>
                <h3 className="text-base font-semibold">Location</h3>
                <p className="mt-1 text-sm text-ink/70">{loc}</p>

                <div className="mt-3 overflow-hidden rounded-app border border-ink/10">
                  <iframe
                    title={`Map of ${loc}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      loc
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-56 w-full md:h-64"
                  />
                </div>

                <p className="mt-2 text-sm">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      loc
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-aegean hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Booking panel */}
          <BookingPanel
            venueId={v.id}
            price={v.price}
            maxGuests={v.maxGuests ?? 1}
            booked={booked}
            venueName={v.name}
            location={loc}
          />
        </section>
      </main>
    </>
  );
}

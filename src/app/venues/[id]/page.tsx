// src/app/venues/[id]/page.tsx
import Link from 'next/link';

import { api, API } from '@/lib/api';
import { type Venue, type VenueResponse, toVenue } from '@/types/venue';
import BookingPanel from './_components/BookingPanel';
import HeroCarousel from './_components/HeroCarousel';
import Rating from './_components/Rating';

export const revalidate = 0;

function money(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function VenueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await api<VenueResponse>(`${API.venues}/${id}`);
  const v: Venue = toVenue(raw);

  const heroFallback = {
    url:
      v.media?.[0]?.url ??
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60&auto=format&fit=crop',
    alt: v.media?.[0]?.alt ?? v.name,
  };

  const loc = v.location
    ? [v.location.city, v.location.country].filter(Boolean).join(', ')
    : undefined;

  return (
    <>
      {/* BREADCRUMBS  */}
      <div className="mx-auto max-w-7xl px-6">
        <nav className="mb-2 pt-3 text-xs text-ink/70">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/venues" className="hover:underline">
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
          showFavorite={true}
        />
      </div>

      <main className="relative z-10 -mt-10 md:-mt-14 mx-auto max-w-6xl px-6">
        <section className="grid gap-6 md:grid-cols-[2fr,1fr] items-start">
          {/* Left titel+description */}
          <div className="card p-5 space-y-5">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {v.name}
                </h1>

                <Rating value={v.rating ?? 0} />
              </div>

              {loc && <p className="mt-1 text-sm text-ink/70">{loc}</p>}

              <p className="mt-2 text-sm text-ink/70">
                Guests: up to {v.maxGuests}
                {typeof v.price === 'number' && (
                  <> &nbsp;•&nbsp; {money(v.price)} / night</>
                )}
              </p>
            </div>

            <hr className="border-ink/10" />

            {/* Description */}
            <div>
              <h2 className="text-base font-semibold">Description</h2>
              <p className="mt-2 text-ink/80">
                {v.description ?? 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-base font-semibold">Amenities</h3>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <Amenity label="Free Wi-Fi" active={!!v.meta?.wifi} />
                <Amenity label="On-site parking" active={!!v.meta?.parking} />
                <Amenity label="Breakfast" active={!!v.meta?.breakfast} />
                <Amenity label="Pets allowed" active={!!v.meta?.pets} />
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-base font-semibold">Policies</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink/80">
                <li>Check-in after 15:00</li>
                <li>Free cancellation up to 48 hours before arrival</li>
                <li>No smoking indoors</li>
              </ul>
            </div>

            {/* Location */}
            {loc && (
              <div>
                <h3 className="text-base font-semibold">Location</h3>
                <p className="mt-1 text-sm text-ink/70">{loc}</p>
                <div className="mt-3 h-40 w-full rounded-app bg-ink/5" />
              </div>
            )}
          </div>

          {/* Right: booking-panel */}
          <BookingPanel
            price={typeof v.price === 'number' ? v.price : undefined}
            maxGuests={v.maxGuests ?? 1}
          />
        </section>
      </main>
    </>
  );
}

function Amenity({ label, active }: { label: string; active: boolean }) {
  return (
    <li className={`flex items-center gap-2 ${active ? '' : 'opacity-40'}`}>
      <span
        className={`inline-block h-2.5 w-2.5 rounded-app ${
          active ? 'bg-aegean' : 'bg-ink/30'
        }`}
      />
      <span>{label}</span>
    </li>
  );
}

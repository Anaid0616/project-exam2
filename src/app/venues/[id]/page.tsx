import Link from 'next/link';
import { getVenueWithBookings } from '@/lib/venuescrud';
import type { VenueWithBookings, BookedLite } from '@/types/venue';
import BookingPanel from './_components/BookingPanel';
import HeroCarousel from './_components/HeroCarousel';
import Rating from './_components/Rating';
import OwnerActions from './_components/OwnerActions';

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
          venueId={v.id}
          showFavorite
        />
      </div>

      <main className="relative z-0 -mt-10 md:-mt-14 mx-auto max-w-6xl px-6">
        <section className="grid gap-6 lg:grid-cols-[1fr,360px] items-start">
          <div className="card p-5 space-y-5">
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
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <Amenity label="Free Wi-Fi" active={!!v.meta?.wifi} />
                <Amenity label="On-site parking" active={!!v.meta?.parking} />
                <Amenity label="Breakfast" active={!!v.meta?.breakfast} />
                <Amenity label="Pets allowed" active={!!v.meta?.pets} />
              </ul>
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

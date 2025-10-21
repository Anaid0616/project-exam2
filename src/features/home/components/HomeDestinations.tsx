import Image from 'next/image';
import Link from 'next/link';
import { listVenuesWithBookings } from '@/lib/venuescrud';
import type { VenueWithBookings } from '@/types/venue';
import { normalizeCountry } from '@/lib/normalizeCountry';

/**
 * HomeDestinations
 *
 * Dynamically shows the 4 most popular countries based on available venues.
 * Each destination card links to `/venues?loc=<country>`.
 */
export default async function HomeDestinations() {
  const venues = await listVenuesWithBookings(100);

  // Group venues by country
  const byCountry: Record<string, VenueWithBookings[]> = {};
  for (const v of venues) {
    const country = normalizeCountry(v.location?.country ?? '');

    if (!country) continue;
    if (!byCountry[country]) byCountry[country] = [];
    byCountry[country].push(v);
  }

  // Sort countries by number of venues (descending)
  const sorted = Object.entries(byCountry)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 6);

  if (sorted.length === 0) return null;

  return (
    <section className="pt-1 pb-6 space-y-8">
      <h2 className="text-2xl font-semibold">Popular Destinations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {sorted.map(([country, venues]) => {
          const img = venues[0]?.media?.[0]?.url ?? '/placeholder.png';
          return (
            <Link
              key={country}
              href={`/venues?loc=${encodeURIComponent(country.toLowerCase())}`}
              className="group relative block overflow-hidden rounded-app shadow-elev hover:shadow-lg transition"
            >
              <Image
                src={img}
                alt={country}
                width={400}
                height={300}
                className="h-[330px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <span className="absolute bottom-4 left-4 text-lg font-semibold text-white capitalize">
                {country}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

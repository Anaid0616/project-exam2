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

  // For each country, sort venues by updated/created date and pick the latest
  const countryData = sorted.map(([country, venues]) => {
    const latestVenue = [...venues].sort((a, b) => {
      const ta =
        (a.updated ? Date.parse(a.updated) : 0) ||
        (a.created ? Date.parse(a.created) : 0) ||
        0;
      const tb =
        (b.updated ? Date.parse(b.updated) : 0) ||
        (b.created ? Date.parse(b.created) : 0) ||
        0;
      return tb - ta; // newest first
    })[0];

    return { country, latestVenue };
  });

  return (
    <section className="pb-6 space-y-6">
      <h3 className="text-2xl font-semibold lg:px-5">Popular Destinations</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto lg:px-5">
        {countryData.map(({ country, latestVenue }) => {
          const img = latestVenue?.media?.[0]?.url ?? '/placeholder.png';
          return (
            <Link
              key={country}
              href={`/venues?loc=${encodeURIComponent(country.toLowerCase())}`}
              aria-label={`View venues in ${country}`}
              className="group relative block overflow-hidden rounded-app shadow-elev hover:shadow-lg transition"
            >
              <Image
                src={img}
                alt=""
                role="presentation"
                width={400}
                height={300}
                className="h-[330px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/50 transition-colors" />
              <span className="absolute bottom-4 left-4 text-2xl font-semibold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] capitalize">
                {country}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

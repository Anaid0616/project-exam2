// app/venues/page.tsx
import SearchFilters from '@/features/search/SearchFilters';
import SearchResultCard from '@/features/search/SearchResultCard';
import { listAllVenuesWithBookings } from '@/lib/venuescrud';
import type { VenueWithBookings } from '@/types/venue';
import { one, int, last, type Sp } from '@/lib/url-params';
import Pagination from '@/components/Pagination';
import SearchHeaderCard from '@/features/search/SearchHeaderCard';
import { normalizeCountry } from '@/lib/normalizeCountry';
import VenuesHero from '@/features/venues/VenuesHero';
import { matchVenueTerm, normalizePlain } from '@/lib/textMatch';

/**
 * Returns `true` when two date ranges overlap.
 * We avoid inclusive-on-touch (A.to > B.from) so a booking that ends on a day
 * does not clash with one that starts the same day.
 *
 * @param aFrom - Range A start
 * @param aTo   - Range A end
 * @param bFrom - Range B start
 * @param bTo   - Range B end
 */
function overlaps(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date): boolean {
  return aFrom < bTo && aTo > bFrom;
}

/**
 * SearchPage (Server Component)
 *
 * Responsibilities
 * 1) Read URL params (where/from/to/guests/priceMax/ratingMin/amenities/sort)
 * 2) Fetch venues (keyword search or plain list)
 * 3) Filter (guests, price, rating, amenities)
 * 4) Sort the results
 * 5) Render desktop sidebar + mobile filters
 *
 * Data flow
 * - All filtering/sorting is server-side for a single render pass.
 * - Controls (SearchFilters, SortMenu) update the URL → this page re-renders.
 *
 */
export default async function SearchPage({
  searchParams,
}: {
  /** Next.js provides search params as a Promise in app router */
  searchParams: Promise<Sp>;
}) {
  /** Resolve URL params */
  const sp = await searchParams;

  // ----- Parse input (same semantics as before) -----
  const whereRaw = (one(sp.where) ?? '').trim();
  const whereLc = whereRaw.toLowerCase();

  const fromStr = one(sp.from) ?? '';
  const toStr = one(sp.to) ?? '';
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;

  const guestsStr = one(sp.guests);
  const priceMaxStr = one(sp.priceMax);
  const ratingStr = one(sp.ratingMin);

  const guests = guestsStr ? int(guestsStr, 0) : null;
  const priceMax = priceMaxStr ? int(priceMaxStr, 0) : null;
  const ratingMin = ratingStr ? int(ratingStr, 0) : null;

  const loc = (last(sp.loc)?.toLowerCase() ?? null) as string | null;

  const want = {
    wifi: one(sp.wifi) === '1',
    parking: one(sp.parking) === '1',
    breakfast: one(sp.breakfast) === '1',
    pets: one(sp.pets) === '1',
  } as const;

  const sort =
    (one(sp.sort) as
      | 'reco'
      | 'price_asc'
      | 'price_desc'
      | 'rating_desc'
      | 'newest_first'
      | undefined) ?? 'reco';

  // ----- Fetch venues -----
  let venues: VenueWithBookings[];
  if (whereLc) {
    venues = await listAllVenuesWithBookings(1000, 100);
  } else {
    venues = await listAllVenuesWithBookings(1000, 100);
  }

  // ----- Filter -----
  let results = venues.filter((v) => {
    // Textmatch (name, city, country) — tolerant
    if (whereLc) {
      if (!matchVenueTerm(v, whereLc, 1)) return false; // 0–2 wrong tolerated
    }

    // Guests
    if (guests && v.maxGuests < guests) return false;

    // Price
    if (priceMax && typeof v.price === 'number' && v.price > priceMax)
      return false;

    // Rating
    if (ratingMin && typeof v.rating === 'number' && v.rating < ratingMin)
      return false;

    // Amenities
    if (want.wifi && !v.meta?.wifi) return false;
    if (want.parking && !v.meta?.parking) return false;
    if (want.breakfast && !v.meta?.breakfast) return false;
    if (want.pets && !v.meta?.pets) return false;

    // Booking clash (date range overlap)
    if (from && to && v.bookings?.length) {
      const clash = v.bookings.some((b) => {
        const bf = new Date(String(b.dateFrom).slice(0, 10));
        const bt = new Date(String(b.dateTo).slice(0, 10));
        return overlaps(from, to, bf, bt);
      });
      if (clash) return false;
    }

    return true;
  });

  // ----- Location filter (country or city) -----
  if (loc) {
    const term = normalizePlain(loc);
    results = results.filter((v) => {
      const city = normalizePlain(v.location?.city ?? '');
      const country = normalizePlain(v.location?.country ?? '');
      return city.includes(term) || country.includes(term);
    });
  }

  // ----- Extra filter: hideZzz -----
  const hideZzz = true;

  results = results.filter((v) => {
    if (hideZzz && /^z+/i.test(v.name ?? '')) return false;

    return true;
  });

  // ----- Location filter (country or city) -----
  if (loc) {
    results = results.filter((v) => {
      const city = (v.location?.city ?? '').toLowerCase();
      const country = normalizeCountry(v.location?.country ?? '').toLowerCase();
      const term = loc.toLowerCase();
      return city.includes(term) || country.includes(term);
    });
  }

  // ----- Sorting -----
  results = results.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return (a.price ?? 0) - (b.price ?? 0);
      case 'price_desc':
        return (b.price ?? 0) - (a.price ?? 0);
      case 'rating_desc':
        return (b.rating ?? 0) - (a.rating ?? 0);
      case 'newest_first': {
        const dateA = new Date(a.created ?? 0).getTime() || 0;
        const dateB = new Date(b.created ?? 0).getTime() || 0;
        return dateB - dateA;
      }
      default:
        return 0;
    }
  });

  // Pagination logic
  const PAGE_SIZE = 12;
  const pageStr = one(sp.page);
  const page = int(pageStr, 1);

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const queryObj = Object.fromEntries(
    Object.entries(sp || {}).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : String(v ?? ''),
    ])
  );

  // ----- UI -----
  return (
    <main className="mx-auto max-w-6xl px-4">
      <VenuesHero />

      {/* --- Panel over hero --- */}
      <div className="relative z-10 flex justify-center -mt-8 sm:-mt-10">
        <div className="pointer-events-auto w-[min(100%,1150px)] pb-4">
          <div
            className="
            rounded-app border shadow-elev p-4 md:p-5
            bg-white/70 supports-[backdrop-filter]:bg-white/60
            backdrop-blur-md border-white/50
          "
          >
            <SearchHeaderCard
              unstyled
              whereRaw={whereRaw}
              fromStr={fromStr}
              toStr={toStr}
              guests={guests ?? undefined}
              resultCount={results.length}
              loc={loc}
            />
          </div>
        </div>
      </div>

      {/* Desktop layout: sticky sidebar + results */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px,1fr]">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <SearchFilters />
        </aside>

        <section className="space-y-4">
          {results.length === 0 ? (
            <p className="text-ink/70">No venues match your filters.</p>
          ) : (
            results
              .slice(start, end)
              .map((v) => <SearchResultCard key={v.id} v={v} />)
          )}

          {/* Pagination */}
          <Pagination
            page={page}
            hasNext={end < results.length}
            path="/venues"
            query={queryObj}
            total={results.length}
            pageSize={PAGE_SIZE}
          />
        </section>
      </div>
    </main>
  );
}

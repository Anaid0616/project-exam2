// app/search/page.tsx

import SearchFilters from '@/features/search/SearchFilters';
import SearchResultCard from '@/features/search/SearchResultCard';
import SortMenu from '@/features/search/SortMenu';
import { listVenuesWithBookings, searchVenues } from '@/lib/venuescrud';
import type { VenueWithBookings } from '@/types/venue';
import HeaderActionsMobile from '@/features/search/HeaderActionsMobile';

/**
 * Query string accepted by the Search page. Matches your existing URL schema.
 */
type SearchQueryParams = {
  where?: string;
  from?: string;
  to?: string;
  guests?: string;
  priceMax?: string;
  ratingMin?: string;
  wifi?: string;
  parking?: string;
  breakfast?: string;
  pets?: string;
  sort?: 'reco' | 'price_asc' | 'price_desc' | 'rating_desc';
};

/**
 * Returns `true` when two date ranges overlap.
 * Inclusive on touching ranges is avoided (A.to > B.from) to prevent
 * booking that ends the same day another starts from being considered a clash.
 *
 * @param aFrom - Range A start
 * @param aTo   - Range A end
 * @param bFrom - Range B start
 * @param bTo   - Range B end
 */
function overlaps(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date) {
  return aFrom < bTo && aTo > bFrom;
}

/**
 * SearchPage (Server Component)
 *
 * Server-rendered page that:
 * 1) Reads search params
 * 2) Fetches venues (either by keyword search or listing)
 * 3) Filters in-memory according to params
 * 4) Sorts the result list
 * 5) Renders the UI with a desktop sidebar and a mobile “Filters” sheet
 *
 * Data flow
 * - All filtering & sorting happens server-side for a single render pass.
 * - Controls (SearchFilters + SortMenu) update the URL, which re-renders this page.
 *
 * Accessibility
 * - Counts and date strings are rendered as plain text; the filter UI handles ARIA.
 */
export default async function SearchPage({
  searchParams,
}: {
  /** Query string provided by Next.js as a promise in app router */
  searchParams: Promise<SearchQueryParams>;
}) {
  /** Resolve URL params */
  const sp = await searchParams;

  // ----- Parse input -----
  const whereRaw = (sp.where ?? '').trim();
  const whereLc = whereRaw.toLowerCase();

  const fromStr = sp.from ?? '';
  const toStr = sp.to ?? '';
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;

  const guests = sp.guests ? Number(sp.guests) : null;
  const priceMax = sp.priceMax ? Number(sp.priceMax) : null;
  const ratingMin = sp.ratingMin ? Number(sp.ratingMin) : null;

  const want = {
    wifi: sp.wifi === '1',
    parking: sp.parking === '1',
    breakfast: sp.breakfast === '1',
    pets: sp.pets === '1',
  } as const;

  const sort = sp.sort ?? 'reco';

  // ----- Fetch venues -----
  let venues: VenueWithBookings[];
  if (whereLc) {
    // Keyword search (server-side), includes bookings for clash detection
    venues = (await searchVenues(whereLc, {
      bookings: true,
      limit: 100,
    })) as VenueWithBookings[];
  } else {
    // Plain list (server-side), capped to a sensible limit
    venues = await listVenuesWithBookings(100);
  }

  // ----- Filter -----
  let results = venues.filter((v) => {
    // Text match (name, city, country)
    if (whereLc) {
      const hay = `${v.name} ${v.location?.city ?? ''} ${
        v.location?.country ?? ''
      }`.toLowerCase();
      if (!hay.includes(whereLc)) return false;
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

  // ----- Sort -----
  results = results.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return (a.price ?? 0) - (b.price ?? 0);
      case 'price_desc':
        return (b.price ?? 0) - (a.price ?? 0);
      case 'rating_desc':
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0; // 'reco' or unknown → leave as-is
    }
  });

  // ----- UI -----
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
      {/* Header card */}
      <div className="panel">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {whereRaw
                ? `Stays in ${whereRaw[0].toUpperCase()}${whereRaw.slice(1)}`
                : 'Stays'}
            </h2>
            <p className="text-ink/70 text-sm">
              {fromStr && toStr ? `${fromStr} – ${toStr}` : 'Any dates'}
              {guests
                ? ` · ${guests} guest${guests > 1 ? 's' : ''}`
                : ' · Any guests'}
              {' · '} {results.length} result{results.length === 1 ? '' : 's'}
            </p>
          </div>

          {/* Desktop and mobile version is below) */}
          <div className="hidden lg:block">
            <SortMenu />
          </div>
        </div>

        {/* Mobile: Filters inside the header card */}
        <HeaderActionsMobile>
          <SearchFilters />
        </HeaderActionsMobile>
      </div>

      {/* Desktop layout: sticky sidebar + results */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px,1fr]">
        <aside
          className="hidden lg:block lg:sticky lg:top-24 lg:self-start
+                   lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
        >
          <SearchFilters />
        </aside>

        <section className="space-y-4">
          {results.length === 0 ? (
            <p className="text-ink/70">No venues match your filters.</p>
          ) : (
            results.map((v) => <SearchResultCard key={v.id} v={v} />)
          )}
        </section>
      </div>
    </main>
  );
}

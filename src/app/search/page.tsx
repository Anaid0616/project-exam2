// app/search/page.tsx
import SearchFilters from '@/features/search/SearchFilters';
import SearchResultCard from '@/features/search/SearchResultCard';
import SortMenu from '@/features/search/SortMenu';
import { listVenuesWithBookings, searchVenues } from '@/lib/venuescrud';
import type { VenueWithBookings } from '@/types/venue';

function overlaps(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date) {
  return aFrom < bTo && aTo > bFrom;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
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
  }>;
}) {
  const sp = await searchParams;

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
  };

  const sort = sp.sort ?? 'reco';

  // ----- get venues -----
  let venues: VenueWithBookings[];
  if (whereLc) {
    venues = (await searchVenues(whereLc, {
      bookings: true,
      limit: 100,
    })) as VenueWithBookings[];
  } else {
    venues = await listVenuesWithBookings(100);
  }

  // ----- Filter -----
  let results = venues.filter((v) => {
    if (whereLc) {
      const hay = `${v.name} ${v.location?.city ?? ''} ${
        v.location?.country ?? ''
      }`.toLowerCase();
      if (!hay.includes(whereLc)) return false;
    }
    if (guests && v.maxGuests < guests) return false;
    if (priceMax && typeof v.price === 'number' && v.price > priceMax)
      return false;
    if (ratingMin && typeof v.rating === 'number' && v.rating < ratingMin)
      return false;

    if (want.wifi && !v.meta?.wifi) return false;
    if (want.parking && !v.meta?.parking) return false;
    if (want.breakfast && !v.meta?.breakfast) return false;
    if (want.pets && !v.meta?.pets) return false;

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
        return 0;
    }
  });

  // ----- UI -----
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
      <div className="panel flex items-center justify-between gap-4">
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
        <SortMenu />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px,1fr]">
        <SearchFilters />
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

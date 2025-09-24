import { listVenuesWithBookings } from '@/lib/venuescrud';
import type { VenueWithBookings } from '@/types/venue';
import VenueCard from '@/components/VenueCard';

function overlaps(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date) {
  return aFrom < bTo && aTo > bFrom; // [from,to) overlap
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { where?: string; from?: string; to?: string; guests?: string };
}) {
  const where = (searchParams.where ?? '').trim().toLowerCase();
  const from = searchParams.from ? new Date(searchParams.from) : null;
  const to = searchParams.to ? new Date(searchParams.to) : null;
  const guests = searchParams.guests ? Number(searchParams.guests) : null;

  const venues = await listVenuesWithBookings();

  const results = venues.filter((v: VenueWithBookings) => {
    if (where) {
      const hay = `${v.name} ${v.location?.city ?? ''} ${
        v.location?.country ?? ''
      }`.toLowerCase();
      if (!hay.includes(where)) return false;
    }
    if (guests && v.maxGuests < guests) return false;

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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1>Search results</h1>
      <p className="text-ink/70">
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>

      <section className="grid-cards">
        {results.map((v) => (
          <VenueCard key={v.id} v={v} />
        ))}
      </section>
    </main>
  );
}

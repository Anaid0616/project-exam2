'use client';
import { useSearchParams } from 'next/navigation';
import InfoCardSkeleton from '@/components/skeletons/BioCardSkeleton';
import BookingCardSkeleton from '@/components/skeletons/BookingCardSkeleton';
import VenueCardSkeleton from '@/components/skeletons/VenueCardSkeleton';
import VenueBookingsSkeleton from '@/components/skeletons/VenueBookingsSkeleton';

export default function Loading() {
  const tab = useSearchParams().get('tab');

  const BookingsGrid = (
    <section className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </section>
  );
  const VenuesGrid = (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </section>
  );

  const body =
    tab === 'bookings' ? (
      BookingsGrid
    ) : tab === 'venueBookings' ? (
      <VenueBookingsSkeleton />
    ) : (
      VenuesGrid
    ); // default: myVenues/saved

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-2 sm:px-6 pt-0">
      <InfoCardSkeleton />
      {body}
    </main>
  );
}

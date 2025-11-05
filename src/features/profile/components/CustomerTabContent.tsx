'use client';

import * as React from 'react';
import BookingCard from '@/features/profile/components/BookingCard';
import BookingCardSkeleton from '@/components/skeletons/BookingCardSkeleton';
import SavedVenues from './SavedVenues';

export type UiBooking = {
  id: string;
  venueId?: string;
  venueName: string;
  when: string;
  total: number;
  image?: string;
  location?: string;
  guests?: number;
  nights: number;
};

export default function CustomerTabContent({
  tab,
  bookings,
  loading,
}: {
  tab: 'bookings' | 'saved';
  bookings: UiBooking[];
  loading: boolean;
}) {
  if (tab === 'saved') return <SavedVenues showSaveOverlay />;

  return (
    <section className="mt-2 space-y-4">
      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-ink/60">No bookings yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {bookings.map((b) => (
            <BookingCard key={b.id} b={b} />
          ))}
        </div>
      )}
    </section>
  );
}

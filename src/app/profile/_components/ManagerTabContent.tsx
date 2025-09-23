'use client';

import * as React from 'react';
import VenueCard from '@/components/VenueCard';
import VenueCardSkeleton from '@/components/skeletons/VenueCardSkeleton';
import BookingCard from '@/components/BookingCard';
import BookingCardSkeleton from '@/components/skeletons/BookingCardSkeleton';
import VenueBookingsSkeleton from '@/components/skeletons/VenueBookingsSkeleton';
import VenueBookingsPanel from '@/components/VenueBookingsPanel';
import SavedVenues from '@/app/profile/_components/SavedVenues';

import type { Venue } from '@/types/venue';
import type { UiBooking } from './CustomerTabContent';
import { useOwnerVenueBookings } from '@/features/venue-bookings/useOwnerVenueBookings';

type OwnerRows = ReturnType<typeof useOwnerVenueBookings>['rows'];

export default function ManagerTabContent({
  tab,
  bookings,
  loadingBookings,
  venues,
  loadingVenues,
  onDeleteVenue,
  venueRows,
  loadingVenueRows,
  venueRowsError,
}: {
  tab: 'bookings' | 'myVenues' | 'venueBookings' | 'saved'; // ⬅️ la till 'saved'
  bookings: UiBooking[];
  loadingBookings: boolean;
  venues: Venue[];
  loadingVenues: boolean;
  onDeleteVenue: (id: string) => void;
  venueRows: OwnerRows;
  loadingVenueRows: boolean;
  venueRowsError?: string | null;
}) {
  return (
    <section className="mt-1 space-y-4">
      {tab === 'saved' && <SavedVenues />}

      {tab === 'bookings' &&
        (loadingBookings ? (
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
        ))}

      {tab === 'myVenues' &&
        (loadingVenues ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VenueCardSkeleton key={i} />
            ))}
          </div>
        ) : venues.length === 0 ? (
          <p className="text-sm text-ink/60">You don’t have any venues yet.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((v) => (
              <VenueCard key={v.id} v={v} showManage onDelete={onDeleteVenue} />
            ))}
          </div>
        ))}

      {tab === 'venueBookings' &&
        (loadingVenueRows ? (
          <VenueBookingsSkeleton />
        ) : venueRowsError ? (
          <p className="text-sm text-red-600">{venueRowsError}</p>
        ) : (
          <VenueBookingsPanel
            rows={venueRows}
            viewBasePath="/profile/bookings"
          />
        ))}
    </section>
  );
}

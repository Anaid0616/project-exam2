'use client';

import * as React from 'react';
import Link from 'next/link';

import { getProfile } from '@/lib/venuescrud';
import InfoCard from '@/components/InfoCard';
import SegButton from '@/components/SegButton';
import BookingCard from '@/components/BookingCard';
import VenueCard from '@/components/VenueCard';
import VenueBookingsTable from '@/components/VenueBookingsTable';

import {
  decodeJwt,
  MOCK_BOOKINGS,
  MOCK_VENUES,
  MOCK_VENUE_BOOKINGS,
} from '@/components/utils';
import type { JwtPayload, Profile } from '@/types/venue';

type Role = 'customer' | 'manager';

export default function ProfileScreen() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);

  const [role, setRole] = React.useState<Role>('customer');
  const [profile, setProfile] = React.useState<Profile | null>(null);

  const [custTab, setCustTab] = React.useState<'bookings' | 'saved'>(
    'bookings'
  );
  const [mgrTab, setMgrTab] = React.useState<
    'bookings' | 'myVenues' | 'venueBookings'
  >('myVenues');

  React.useEffect(() => {
    const t =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const p = t ? decodeJwt(t) : null;
    setPayload(p);

    const name = p?.name;
    if (t && name) {
      getProfile(name)
        .then((pData) => {
          setProfile(pData);
          setRole(pData.venueManager ? 'manager' : 'customer');
        })
        .catch(() => setRole('customer'));
    }
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 pt-0">
      <InfoCard payload={payload} role={role} profile={profile ?? undefined} />

      {role === 'customer' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {custTab === 'bookings' ? 'Upcoming bookings' : 'Saved venues'}
            </h2>
            <div className="flex gap-2">
              <SegButton
                active={custTab === 'bookings'}
                onClick={() => setCustTab('bookings')}
              >
                Bookings
              </SegButton>
              <SegButton
                active={custTab === 'saved'}
                onClick={() => setCustTab('saved')}
              >
                Saved
              </SegButton>
            </div>
          </div>

          {custTab === 'bookings' ? (
            <div className="grid gap-3 md:grid-cols-2">
              {MOCK_BOOKINGS.map((b) => (
                <BookingCard key={b.id} b={b} />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_VENUES.map((v) => (
                <VenueCard key={v.id} v={v} />
              ))}
            </div>
          )}
        </section>
      )}

      {role === 'manager' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {mgrTab === 'bookings'
                ? 'Upcoming bookings'
                : mgrTab === 'myVenues'
                ? 'My Venues'
                : 'Venue Bookings'}
            </h2>
            <div className="flex items-center gap-2">
              <SegButton
                active={mgrTab === 'bookings'}
                onClick={() => setMgrTab('bookings')}
              >
                Bookings
              </SegButton>
              <SegButton
                active={mgrTab === 'myVenues'}
                onClick={() => setMgrTab('myVenues')}
              >
                My Venues
              </SegButton>
              <SegButton
                active={mgrTab === 'venueBookings'}
                onClick={() => setMgrTab('venueBookings')}
              >
                Venue Bookings
              </SegButton>
              <Link href="/venues/create" className="btn btn-primary">
                Create venue
              </Link>
            </div>
          </div>

          {mgrTab === 'bookings' && (
            <div className="grid gap-3 md:grid-cols-2">
              {MOCK_BOOKINGS.map((b) => (
                <BookingCard key={b.id} b={b} />
              ))}
            </div>
          )}

          {mgrTab === 'myVenues' && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_VENUES.map((v) => (
                <VenueCard
                  key={v.id}
                  v={v}
                  showManage
                  onDelete={(id) => {
                    if (confirm('Delete this venue?')) {
                      console.log('Delete venue', id);
                      // TODO: call DELETE /venues/:id with token
                    }
                  }}
                />
              ))}
            </div>
          )}

          {mgrTab === 'venueBookings' && (
            <VenueBookingsTable rows={MOCK_VENUE_BOOKINGS} />
          )}
        </section>
      )}
    </main>
  );
}

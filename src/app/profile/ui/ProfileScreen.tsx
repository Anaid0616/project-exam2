'use client';

import * as React from 'react';
import Link from 'next/link';

import { getProfile, getMyVenues, deleteVenue } from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';
import InfoCard from '@/components/InfoCard';
import SegButton from '@/components/SegButton';
import BookingCard from '@/components/BookingCard';
import VenueCard from '@/components/VenueCard';
import VenueBookingsTable from '@/components/VenueBookingsTable';

import {
  decodeJwt,
  MOCK_BOOKINGS,
  MOCK_VENUE_BOOKINGS,
} from '@/components/utils';
import type { JwtPayload, Profile } from '@/types/venue';

type Role = 'customer' | 'manager';

export default function ProfileScreen() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [role, setRole] = React.useState<Role>('customer');
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [myVenues, setMyVenues] = React.useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = React.useState(false);

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
    if (!t || !name) return;

    (async () => {
      try {
        const pData = await getProfile(name);
        setProfile(pData);
        const r: Role = pData.venueManager ? 'manager' : 'customer';
        setRole(r);

        if (r === 'manager') {
          setLoadingVenues(true);
          const venues = await getMyVenues(name);
          setMyVenues(venues ?? []);
        }
      } catch {
        setRole('customer');
      } finally {
        setLoadingVenues(false);
      }
    })();
  }, []);

  async function handleDeleteVenue(id: string) {
    if (!confirm('Delete this venue?')) return;
    try {
      await deleteVenue(id);
      setMyVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  }

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
            <p className="text-sm text-ink/60">No saved venues yet.</p>
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
            <>
              {loadingVenues ? (
                <p className="text-sm text-ink/60">Loading your venues…</p>
              ) : myVenues.length === 0 ? (
                <p className="text-sm text-ink/60">
                  You don’t have any venues yet.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {myVenues.map((v) => (
                    <VenueCard
                      key={v.id}
                      v={v}
                      showManage
                      onDelete={handleDeleteVenue}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {mgrTab === 'venueBookings' && (
            <VenueBookingsTable rows={MOCK_VENUE_BOOKINGS} />
          )}
        </section>
      )}
    </main>
  );
}

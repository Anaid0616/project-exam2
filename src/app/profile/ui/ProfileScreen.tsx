'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  getProfile,
  getMyVenues,
  deleteVenue,
  getMyBookings,
  type ApiBooking,
} from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';
import InfoCard from '@/components/InfoCard';
import SegButton from '@/components/SegButton';
import BookingCard from '@/components/BookingCard';
import VenueCard from '@/components/VenueCard';
import VenueBookingsTable from '@/components/VenueBookingsTable';

import { decodeJwt, MOCK_VENUE_BOOKINGS } from '@/components/utils';
import type { JwtPayload, Profile } from '@/types/venue';

type Role = 'customer' | 'manager';

/** UI-typ för BookingCard */
type UiBooking = {
  id: string;
  venueId?: string; // <--- lägg till
  venueName: string;
  when: string;
  total: number; // EUR
  image?: string;
};

function nightsBetween(from: string, to: string) {
  const a = new Date(from);
  const b = new Date(to);
  const d = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
}

function toUiBooking(b: ApiBooking): UiBooking {
  const from = String(b.dateFrom).slice(0, 10);
  const to = String(b.dateTo).slice(0, 10);
  const name = b.venue?.name ?? 'Venue';
  const image = b.venue?.media?.[0]?.url;
  const price = Number(b.venue?.price ?? 0);

  const nights = nightsBetween(from, to);
  const total = price && nights ? price * nights : 0;

  return {
    id: b.id,
    venueId: b.venue?.id, // <--- NY
    venueName: name,
    when: `${from}–${to}`,
    total,
    image,
  };
}

export default function ProfileScreen() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [role, setRole] = React.useState<Role>('customer');
  const [profile, setProfile] = React.useState<Profile | null>(null);

  const [myVenues, setMyVenues] = React.useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = React.useState(false);

  const [myBookings, setMyBookings] = React.useState<UiBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = React.useState(false);

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
          setLoadingVenues(false);
        } else {
          setLoadingBookings(true);
          const apiBookings = await getMyBookings(name); // ApiBooking[]
          const ui = apiBookings.map(toUiBooking);
          setMyBookings(ui);
          setLoadingBookings(false);
        }
      } catch {
        setRole('customer');
        setLoadingBookings(false);
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
            loadingBookings ? (
              <p className="text-sm text-ink/60">Loading bookings…</p>
            ) : myBookings.length === 0 ? (
              <p className="text-sm text-ink/60">No bookings yet.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {myBookings.map((b) => (
                  <BookingCard key={b.id} b={b} />
                ))}
              </div>
            )
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
            <p className="text-sm text-ink/60">
              (Hook upp till manager-bookings när du vill)
            </p>
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

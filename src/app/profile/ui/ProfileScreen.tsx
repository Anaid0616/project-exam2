'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import InfoCard from '@/components/InfoCard';
import BookingCard from '@/components/BookingCard';
import VenueCard from '@/components/VenueCard';
import SavedVenues from '@/app/profile/_components/SavedVenues';
import VenueBookingsPanel from '@/components/VenueBookingsPanel';

import {
  getProfile,
  getMyVenues,
  deleteVenue,
  getMyBookings,
  type ApiBooking,
} from '@/lib/venuescrud';

import { useOwnerVenueBookings } from '@/features/venue-bookings/useOwnerVenueBookings';

import type { Venue, JwtPayload, Profile } from '@/types/venue';
import { decodeJwt } from '@/components/utils';

type Role = 'customer' | 'manager';

type UiBooking = {
  id: string;
  venueId?: string;
  venueName: string;
  when: string;
  total: number;
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
    venueId: b.venue?.id,
    venueName: name,
    when: `${from}–${to}`,
    total,
    image,
  };
}

// helper tab
const tabClass = (active: boolean) =>
  `px-3 py-2 -mb-px text-sm border-b-[4px] ${
    active
      ? 'border-lagoon text-ink'
      : 'border-transparent text-ink/70 hover:text-ink'
  }`;

export default function ProfileScreen() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [role, setRole] = React.useState<Role>('customer');
  const [profile, setProfile] = React.useState<Profile | null>(null);

  const [myVenues, setMyVenues] = React.useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = React.useState(false);

  const [myBookings, setMyBookings] = React.useState<UiBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = React.useState(false);

  const params = useSearchParams();
  const initialCustTab: 'bookings' | 'saved' = params.get('saved')
    ? 'saved'
    : 'bookings';
  const [custTab, setCustTab] = React.useState<'bookings' | 'saved'>(
    initialCustTab
  );

  const [mgrTab, setMgrTab] = React.useState<
    'bookings' | 'myVenues' | 'venueBookings'
  >('myVenues');

  React.useEffect(() => {
    if (role === 'customer') {
      setCustTab(params.get('saved') ? 'saved' : 'bookings');
    }
  }, [params, role]);

  React.useEffect(() => {
    const t =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const p = t ? decodeJwt(t) : null;
    setPayload(p);

    const name = p?.name;
    if (!t || !name) return;

    (async () => {
      try {
        // profil + roll
        const pData = await getProfile(name);
        setProfile(pData);
        const r: Role = pData.venueManager ? 'manager' : 'customer';
        setRole(r);

        // mina bookings (gäller båda roller)
        setLoadingBookings(true);
        try {
          const apiBookings = await getMyBookings(name);
          setMyBookings(apiBookings.map(toUiBooking));
        } finally {
          setLoadingBookings(false);
        }

        // mina venues (om manager)
        if (r === 'manager') {
          setLoadingVenues(true);
          try {
            const venues = await getMyVenues(name);
            setMyVenues(venues ?? []);
          } finally {
            setLoadingVenues(false);
          }
        }
      } catch {
        setRole('customer');
        setLoadingBookings(false);
        setLoadingVenues(false);
      }
    })();
  }, []);

  // ----- Venue bookings (ägare) via hook -----
  const ownerName = profile?.name ?? payload?.name ?? undefined;
  const {
    rows: venueRows,
    loading: loadingVenueRows,
    error: venueRowsError,
  } = useOwnerVenueBookings(
    ownerName,
    role === 'manager' && mgrTab === 'venueBookings'
  );
  // -------------------------------------------

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
            <div className="flex gap-1 border-b border-ink/10">
              <button
                role="tab"
                aria-selected={custTab === 'bookings'}
                onClick={() => setCustTab('bookings')}
                className={tabClass(custTab === 'bookings')}
              >
                Bookings
              </button>
              <button
                role="tab"
                aria-selected={custTab === 'saved'}
                onClick={() => setCustTab('saved')}
                className={tabClass(custTab === 'saved')}
              >
                Saved
              </button>
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
            <SavedVenues />
          )}
        </section>
      )}

      {role === 'manager' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 border-b border-ink/10">
              <button
                role="tab"
                aria-selected={mgrTab === 'bookings'}
                onClick={() => setMgrTab('bookings')}
                className={tabClass(mgrTab === 'bookings')}
              >
                Bookings
              </button>
              <button
                role="tab"
                aria-selected={mgrTab === 'myVenues'}
                onClick={() => setMgrTab('myVenues')}
                className={tabClass(mgrTab === 'myVenues')}
              >
                My Venues
              </button>
              <button
                role="tab"
                aria-selected={mgrTab === 'venueBookings'}
                onClick={() => setMgrTab('venueBookings')}
                className={tabClass(mgrTab === 'venueBookings')}
              >
                Venue Bookings
              </button>
            </div>

            <Link href="/venues/create" className="btn btn-primary">
              Create venue
            </Link>
          </div>

          {mgrTab === 'bookings' &&
            (loadingBookings ? (
              <p className="text-sm text-ink/60">Loading bookings…</p>
            ) : myBookings.length === 0 ? (
              <p className="text-sm text-ink/60">No bookings yet.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {myBookings.map((b) => (
                  <BookingCard key={b.id} b={b} />
                ))}
              </div>
            ))}

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
            <>
              {loadingVenueRows && (
                <p className="text-sm text-ink/60">Loading venue bookings…</p>
              )}
              {venueRowsError && (
                <p className="text-sm text-red-600">{venueRowsError}</p>
              )}
              {!loadingVenueRows && !venueRowsError && (
                <VenueBookingsPanel
                  rows={venueRows}
                  viewBasePath="/profile/bookings"
                />
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}

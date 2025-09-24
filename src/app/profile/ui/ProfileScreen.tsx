'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

import InfoCard from '@/components/InfoCard';
import InfoCardSkeleton from '@/components/skeletons/InfoCardSkeleton';
import EditProfileModal, {
  type EditProfileForm,
} from '@/components/EditProfileModal';

import {
  getProfile,
  getMyVenues,
  deleteVenue,
  getMyBookings,
  updateProfile,
  type ApiBooking,
} from '@/lib/venuescrud';

import { useOwnerVenueBookings } from '@/features/venue-bookings/useOwnerVenueBookings';
import type { Venue, JwtPayload, Profile } from '@/types/venue';
import { decodeJwt } from '@/components/utils';

// components
import ProfileTabsBar from '../_components/ProfileTabsBar';
import CustomerTabContent from '../_components/CustomerTabContent';
import type { UiBooking } from '../_components/CustomerTabContent';
import ManagerTabContent from '../_components/ManagerTabContent';

type Role = 'customer' | 'manager';

/* ===== Helpers ===== */
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

export default function ProfileScreen() {
  const params = useSearchParams();

  // auth + profile
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [role, setRole] = React.useState<Role>('customer');
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [editOpen, setEditOpen] = React.useState(false);

  // listings
  const [myVenues, setMyVenues] = React.useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = React.useState(false);

  // bookings
  const [myBookings, setMyBookings] = React.useState<UiBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = React.useState(false);

  // tabs
  const initialCustTab: 'bookings' | 'saved' = params.get('saved')
    ? 'saved'
    : 'bookings';
  const [custTab, setCustTab] = React.useState<'bookings' | 'saved'>(
    initialCustTab
  );
  const [mgrTab, setMgrTab] = React.useState<
    'bookings' | 'myVenues' | 'venueBookings' | 'saved'
  >('myVenues');

  //
  React.useEffect(() => {
    if (role === 'customer') {
      setCustTab(params.get('saved') ? 'saved' : 'bookings');
    } else if (role === 'manager') {
      if (params.get('saved')) setMgrTab('saved');
    }
  }, [params, role]);

  // fetch
  React.useEffect(() => {
    let alive = true;

    (async () => {
      if (!alive) return;
      setLoadingProfile(true);
      try {
        const t =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const p = t ? decodeJwt(t) : null;
        if (!alive) return;

        setPayload(p);
        const name = p?.name;

        // ⬇️ Viktigt: släck alla loaders även vid tidig exit
        if (!t || !name) {
          if (!alive) return;
          setRole('customer');
          setLoadingBookings(false);
          setLoadingVenues(false);
          setLoadingProfile(false);
          return;
        }

        // profil + roll
        const pData = await getProfile(name);
        if (!alive) return;
        setProfile(pData);

        const r: Role = pData.venueManager ? 'manager' : 'customer';
        setRole(r);

        // bookings (båda roller)
        setLoadingBookings(true);
        try {
          const apiBookings = await getMyBookings(name);
          if (!alive) return;
          setMyBookings(apiBookings.map(toUiBooking));
        } finally {
          if (alive) setLoadingBookings(false);
        }

        // venues (manager)
        if (r === 'manager') {
          setLoadingVenues(true);
          try {
            const venues = await getMyVenues(name);
            if (!alive) return;
            setMyVenues(venues ?? []);
          } finally {
            if (alive) setLoadingVenues(false);
          }
        }
      } catch {
        if (!alive) return;
        setRole('customer');
        setLoadingBookings(false);
        setLoadingVenues(false);
      } finally {
        if (alive) setLoadingProfile(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // venue bookings table (owner)
  const ownerName = profile?.name ?? payload?.name ?? undefined;
  const {
    rows: venueRows,
    loading: loadingVenueRows,
    error: venueRowsError,
  } = useOwnerVenueBookings(
    ownerName,
    role === 'manager' && mgrTab === 'venueBookings'
  );

  async function handleDeleteVenue(id: string) {
    if (!confirm('Delete this venue?')) return;
    try {
      await deleteVenue(id);
      setMyVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  async function handleSaveProfile(values: EditProfileForm) {
    if (!profile?.name) return;

    const payloadToSend = {
      ...(values.name ? { name: values.name } : {}),
      ...(values.bio !== undefined ? { bio: values.bio } : {}),
      ...(values.avatarUrl !== undefined
        ? values.avatarUrl
          ? { avatar: { url: values.avatarUrl } }
          : { avatar: null }
        : {}),
      ...(values.bannerUrl !== undefined
        ? values.bannerUrl
          ? { banner: { url: values.bannerUrl } }
          : { banner: null }
        : {}),
    };

    const updated = await updateProfile(profile.name, payloadToSend);
    setProfile(updated);
    setEditOpen(false);
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 pt-0">
      {/* ==== InfoCard ==== */}
      {loadingProfile ? (
        <InfoCardSkeleton />
      ) : (
        <InfoCard
          payload={payload}
          role={role}
          profile={profile ?? undefined}
          onEdit={() => setEditOpen(true)}
          // children section
          childrenClassName="mt-2 pt-2"
        >
          <ProfileTabsBar
            role={role}
            custTab={custTab}
            setCustTab={setCustTab}
            mgrTab={mgrTab}
            setMgrTab={setMgrTab}
          />
        </InfoCard>
      )}

      {/* ==== Tab content ==== */}
      {role === 'customer' ? (
        <CustomerTabContent
          tab={custTab}
          bookings={myBookings}
          loading={loadingBookings}
        />
      ) : (
        <ManagerTabContent
          tab={mgrTab}
          bookings={myBookings}
          loadingBookings={loadingBookings}
          venues={myVenues}
          loadingVenues={loadingVenues}
          onDeleteVenue={handleDeleteVenue}
          venueRows={venueRows}
          loadingVenueRows={loadingVenueRows}
          venueRowsError={venueRowsError}
        />
      )}

      {/* ==== Edit modal ==== */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={{
          avatarUrl: profile?.avatar?.url ?? '',
          bannerUrl: profile?.banner?.url ?? '',
          name: profile?.name ?? '',
          bio: profile?.bio ?? '',
        }}
        onSave={handleSaveProfile}
      />
    </main>
  );
}

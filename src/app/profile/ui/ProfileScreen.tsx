'use client';

import * as React from 'react';

import InfoCard from '@/components/InfoCard';
import InfoCardSkeleton from '@/components/skeletons/InfoCardSkeleton';
import EditProfileModal, {
  type EditProfileForm,
} from '@/components/EditProfileModal';

import { updateProfile } from '@/lib/venuescrud';
import { useOwnerVenueBookings } from '@/features/venue-bookings/useOwnerVenueBookings';
import { useProfileBootstrap } from '@/features/profile/useProfileBootstrap';
import { useProfileTabs } from '@/features/profile/useProfileTabs';
import { useMyBookings } from '@/features/bookings/useMyBookings';
import { useMyVenues } from '@/features/venues/useMyVenues';
import { useDeleteVenue } from '@/features/venues/useDeleteVenue';

// components
import ProfileTabsBar from '../_components/ProfileTabsBar';
import CustomerTabContent from '../_components/CustomerTabContent';
import ManagerTabContent from '../_components/ManagerTabContent';

export default function ProfileScreen() {
  // Bootstrap profile + role
  const { payload, profile, setProfile, role, loading } = useProfileBootstrap();

  // Tabs
  const { custTab, setCustTab, mgrTab, setMgrTab } = useProfileTabs(role);

  // Data
  const ownerName = profile?.name ?? payload?.name ?? undefined;

  const { rows: myBookings, loading: loadingBookings } =
    useMyBookings(ownerName);
  const {
    rows: myVenues,
    setRows: setMyVenues,
    loading: loadingVenues,
  } = useMyVenues(ownerName, role === 'manager');

  const {
    rows: venueRows,
    loading: loadingVenueRows,
    error: venueRowsError,
  } = useOwnerVenueBookings(
    ownerName,
    role === 'manager' && mgrTab === 'venueBookings'
  );

  // Delete (modal + toast)
  const { openDelete, deleteModal } = useDeleteVenue({
    onDeleted: (id) => setMyVenues((prev) => prev.filter((v) => v.id !== id)),
  });
  function handleDeleteVenue(id: string) {
    openDelete(id);
  }

  // Edit profile modal
  const [editOpen, setEditOpen] = React.useState(false);
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
    <main className="mx-auto max-w-6xl space-y-6 px-2 sm:px-6 pt-0">
      {/* ==== Header card ==== */}
      {loading ? (
        <InfoCardSkeleton />
      ) : (
        <InfoCard
          payload={payload}
          role={role}
          profile={profile ?? undefined}
          onEdit={() => setEditOpen(true)}
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

      {/* ==== Tabs content ==== */}
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

      {/* ==== Edit profile modal ==== */}
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

      {/* ==== Delete modal ==== */}
      {deleteModal}
    </main>
  );
}

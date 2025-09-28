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

/**
 * ProfileScreen
 *
 * Page component for the profile area. It:
 * - Bootstraps auth/profile and resolves the user's role (customer vs manager).
 * - Manages tab state and renders the correct tab content.
 * - Loads bookings and venues via feature hooks.
 * - Exposes edit-profile (modal) and delete-venue (confirm modal) flows.
 *
 * Notes:
 * - This component is intentionally thin; most logic is extracted into hooks:
 *   - useProfileBootstrap      → loads auth payload + profile + role
 *   - useProfileTabs           → syncs active tab(s) with URL params
 *   - useMyBookings            → loads a user's bookings (customer & manager)
 *   - useMyVenues              → loads venues for venue managers
 *   - useOwnerVenueBookings    → loads bookings for venues the user owns
 *   - useDeleteVenue           → confirm modal + delete API + toasts
 */
export default function ProfileScreen() {
  /** Bootstrap user payload, profile and role (customer | manager). */
  const { payload, profile, setProfile, role, loading } = useProfileBootstrap();

  /** Active tab state derived from the role and URL params. */
  const { custTab, setCustTab, mgrTab, setMgrTab } = useProfileTabs(role);

  /** Owner name used by the data hooks (prefer profile.name, fallback to token payload). */
  const ownerName = profile?.name ?? payload?.name ?? undefined;

  /** Bookings for the signed-in user (customer & manager). */
  const { rows: myBookings, loading: loadingBookings } =
    useMyBookings(ownerName);

  /** Venues owned by the user (only when manager). */
  const {
    rows: myVenues,
    setRows: setMyVenues,
    loading: loadingVenues,
  } = useMyVenues(ownerName, role === 'manager');

  /** Bookings made on the user's venues (manager-only tab). */
  const {
    rows: venueRows,
    loading: loadingVenueRows,
    error: venueRowsError,
  } = useOwnerVenueBookings(
    ownerName,
    role === 'manager' && mgrTab === 'venueBookings'
  );

  // combine bootstrap-loading with hook loadings to avoid early "empty" states
  const bootLoading = loading || !ownerName;
  const bookingsLoading = bootLoading || loadingBookings;
  const venuesLoading = bootLoading || (role === 'manager' && loadingVenues);
  const venueRowsLoading = bootLoading || loadingVenueRows;

  /**
   * Delete flow for a venue (confirm modal + API + toast).
   * The hook returns:
   * - openDelete(id): call to open the confirm dialog for a specific venue
   * - deleteModal: the dialog element to render once
   */
  const { openDelete, deleteModal } = useDeleteVenue({
    onDeleted: (id) => setMyVenues((prev) => prev.filter((v) => v.id !== id)),
  });

  /**
   * Open the delete confirmation for a given venue id.
   * @param id Venue id
   */
  function handleDeleteVenue(id: string) {
    openDelete(id);
  }

  /** Local state controlling the Edit Profile modal. */
  const [editOpen, setEditOpen] = React.useState(false);

  /**
   * Handle profile updates from the EditProfileModal.
   * Builds the minimal payload and issues a PUT via `updateProfile`,
   * then updates local state and closes the modal.
   *
   * @param values form values from the EditProfileModal
   */
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
      {/* ==== Header card (profile summary + tabs) ==== */}
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
          loading={bookingsLoading}
        />
      ) : (
        <ManagerTabContent
          tab={mgrTab}
          bookings={myBookings}
          loadingBookings={bookingsLoading}
          venues={myVenues}
          loadingVenues={venuesLoading}
          onDeleteVenue={handleDeleteVenue}
          venueRows={venueRows}
          loadingVenueRows={venueRowsLoading}
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

      {/* ==== Delete venue modal (rendered once from the hook) ==== */}
      {deleteModal}
    </main>
  );
}

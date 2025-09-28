'use client';

import * as React from 'react';
import { useUser } from '@/providers/UserProvider';
import { useFavorites } from '@/features/favorites/useFavorites';
import { getVenue } from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';
import VenueCard from '@/components/VenueCard';
import VenueCardSkeleton from '@/components/skeletons/VenueCardSkeleton';

export default function SavedVenues({
  showSaveOverlay = false,
}: {
  showSaveOverlay?: boolean;
}) {
  const { email } = useUser();
  const { ids } = useFavorites(email);

  const [venues, setVenues] = React.useState<Venue[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Load full venue objects for the favorite ids
  React.useEffect(() => {
    let active = true;

    (async () => {
      // No favorites → clear and stop
      if (!ids || ids.length === 0) {
        if (active) setVenues([]);
        return;
      }

      setLoading(true);
      try {
        const data = await Promise.all(ids.map((id) => getVenue(id)));
        if (active) setVenues(data.filter(Boolean) as Venue[]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [ids]);

  // ----- Render states -----

  // Skeletons while we’re fetching or while we have ids but haven’t resolved venues yet
  const showSkeletons =
    loading || (Array.isArray(ids) && ids.length > 0 && venues.length === 0);

  if (showSkeletons) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <VenueCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No favorites
  if (!ids || ids.length === 0) {
    return <p className="text-sm text-ink/60">No saved venues yet.</p>;
  }

  // Favorites exist but failed to load their details
  if (venues.length === 0) {
    return <p className="text-sm text-ink/60">Couldn’t load saved venues.</p>;
  }

  // Loaded
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {venues.map((v) => (
        <VenueCard key={v.id} v={v} showSave={showSaveOverlay} />
      ))}
    </div>
  );
}

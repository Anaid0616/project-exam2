// src/app/profile/_components/SavedVenues.tsx
'use client';

import * as React from 'react';
import { useUser } from '@/providers/UserProvider';
import { useFavorites } from '@/features/favorites/useFavorites';
import { getVenue } from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';
import VenueCard from '@/components/VenueCard';

export default function SavedVenues() {
  const { email } = useUser();
  const { ids } = useFavorites(email);

  const [venues, setVenues] = React.useState<Venue[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    (async () => {
      if (!ids.length) {
        setVenues([]);
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

  if (loading && venues.length === 0) {
    return <p className="text-sm text-ink/60">Loading saved venues…</p>;
  }
  if (!ids.length) {
    return <p className="text-sm text-ink/60">No saved venues yet.</p>;
  }
  if (!venues.length) {
    return <p className="text-sm text-ink/60">Couldn’t load saved venues.</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {venues.map((v) => (
        <VenueCard key={v.id} v={v} />
      ))}
    </div>
  );
}

// src/features/venues/useMyVenues.ts (in profilescreen)
'use client';
import * as React from 'react';
import { getMyVenues } from '@/features/venues/api/venues.api';
import type { Venue } from '@/types/venue';

export function useMyVenues(name?: string, enabled = false) {
  const [rows, setRows] = React.useState<Venue[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!enabled || !name) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const list = await getMyVenues(name);
        if (!alive) return;
        setRows(list ?? []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [name, enabled]);

  return { rows, setRows, loading };
}

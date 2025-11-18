// src/features/venues/useMyVenues.ts
'use client';

import * as React from 'react';
import { getMyVenues } from '@/features/venues/api/venues.api';
import type { Venue } from '@/types/venue';

/**
 * Fetches the venues owned/managed by a specific profile.
 *
 * Features:
 * - Optional activation via the `enabled` flag (useful to avoid running before user data is ready)
 * - Reactively reloads whenever the profile name or `enabled` value changes
 * - Prevents state updates on unmounted components using an `alive` flag
 *
 * Typical usage inside profile screens:
 * ```tsx
 * const { rows, loading } = useMyVenues(profile?.name, !!profile);
 * ```
 *
 * @param {string | undefined} name - Profile name to fetch venues for.
 * @param {boolean} enabled - Whether the query should run. Defaults to `false`.
 * @returns {{
 *   rows: Venue[];
 *   setRows: React.Dispatch<React.SetStateAction<Venue[]>>;
 *   loading: boolean;
 * }} Venue list, setter, and loading state.
 */
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

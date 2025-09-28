'use client';
import * as React from 'react';
import { getMyBookings, type ApiBooking } from '@/lib/venuescrud';
import { toUiBooking } from './mappers';
import type { UiBooking } from '@/app/profile/_components/CustomerTabContent';

export function useMyBookings(name?: string) {
  const [rows, setRows] = React.useState<UiBooking[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!name) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const api: ApiBooking[] = await getMyBookings(name);
        if (!alive) return;
        setRows(api.map(toUiBooking));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [name]);

  return { rows, setRows, loading };
}

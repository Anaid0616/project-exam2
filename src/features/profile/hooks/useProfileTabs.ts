// src/features/profile/useProfileTabs.ts
'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import type { Role } from './useProfileBootstrap';

export function useProfileTabs(role: Role) {
  const params = useSearchParams();

  // --- CUSTOMER tabs ---
  const initialCustTab: 'bookings' | 'saved' =
    (params.get('tab') as 'bookings' | 'saved') ??
    (params.get('saved') ? 'saved' : 'bookings');

  const [custTab, setCustTab] = React.useState<'bookings' | 'saved'>(
    initialCustTab
  );

  // --- MANAGER tabs ---
  const initialMgrTab: 'bookings' | 'myVenues' | 'venueBookings' | 'saved' =
    (params.get('tab') as
      | 'bookings'
      | 'myVenues'
      | 'venueBookings'
      | 'saved') ?? 'myVenues';

  const [mgrTab, setMgrTab] = React.useState<
    'bookings' | 'myVenues' | 'venueBookings' | 'saved'
  >(initialMgrTab);

  // --- Sync on URL changes ---
  React.useEffect(() => {
    const tab = params.get('tab');
    if (role === 'customer') {
      if (tab === 'bookings' || tab === 'saved') setCustTab(tab);
      else setCustTab(params.get('saved') ? 'saved' : 'bookings');
    } else {
      if (
        tab === 'bookings' ||
        tab === 'myVenues' ||
        tab === 'venueBookings' ||
        tab === 'saved'
      ) {
        setMgrTab(tab);
      } else if (params.get('saved')) {
        setMgrTab('saved');
      }
    }
  }, [params, role]);

  return { custTab, setCustTab, mgrTab, setMgrTab };
}

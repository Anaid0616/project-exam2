// src/features/profile/useProfileTabs.ts (use in profilescreen)
'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import type { Role } from './useProfileBootstrap';

export function useProfileTabs(role: Role) {
  const params = useSearchParams();
  const initialCustTab: 'bookings' | 'saved' = params.get('saved')
    ? 'saved'
    : 'bookings';
  const [custTab, setCustTab] = React.useState<'bookings' | 'saved'>(
    initialCustTab
  );
  const [mgrTab, setMgrTab] = React.useState<
    'bookings' | 'myVenues' | 'venueBookings' | 'saved'
  >('myVenues');

  React.useEffect(() => {
    if (role === 'customer') {
      setCustTab(params.get('saved') ? 'saved' : 'bookings');
    } else {
      if (params.get('saved')) setMgrTab('saved');
    }
  }, [params, role]);

  return { custTab, setCustTab, mgrTab, setMgrTab };
}

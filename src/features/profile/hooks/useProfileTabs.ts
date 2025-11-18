// src/features/profile/useProfileTabs.ts
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import type { Role } from './useProfileBootstrap';

/**
 * Manages tab state for the profile page, keeping it in sync with URL query parameters.
 *
 * Behavior:
 * - For **customers**: available tabs → `bookings`, `saved`
 * - For **managers**: available tabs → `bookings`, `myVenues`, `venueBookings`, `saved`
 * - Reads initial tab from `?tab=` in the URL
 * - Falls back to default tabs when no valid tab param is found
 * - Reacts to URL changes to keep state aligned with navigation
 *
 * @param {Role} role - The user's role, used to determine which tab set to use.
 *
 * @returns {{
 *   custTab: 'bookings' | 'saved';
 *   setCustTab: React.Dispatch<React.SetStateAction<'bookings' | 'saved'>>;
 *   mgrTab: 'bookings' | 'myVenues' | 'venueBookings' | 'saved';
 *   setMgrTab: React.Dispatch<React.SetStateAction<'bookings' | 'myVenues' | 'venueBookings' | 'saved'>>;
 * }} Customer/manager tab state and setters.
 */
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

  // --- Sync when URL params change ---
  React.useEffect(() => {
    const tab = params.get('tab');

    if (role === 'customer') {
      if (tab === 'bookings' || tab === 'saved') {
        setCustTab(tab);
      } else {
        setCustTab(params.get('saved') ? 'saved' : 'bookings');
      }
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

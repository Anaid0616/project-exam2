'use client';

import * as React from 'react';

type Role = 'customer' | 'manager';

// tabclass
export function tabClass(active: boolean) {
  return `px-2.5 py-1.5 -mb-px leading-tight border-b-[4px]
          ${
            active
              ? 'border-lagoon text-ink'
              : 'border-transparent text-ink/70 hover:text-ink'
          }`;
}

export default function ProfileTabsBar({
  role,
  custTab,
  setCustTab,
  mgrTab,
  setMgrTab,
  className = '',
}: {
  role: Role;
  custTab?: 'bookings' | 'saved';
  setCustTab?: (t: 'bookings' | 'saved') => void;

  mgrTab?: 'bookings' | 'myVenues' | 'venueBookings' | 'saved';
  setMgrTab?: (t: 'bookings' | 'myVenues' | 'venueBookings' | 'saved') => void;
  className?: string;
}) {
  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {role === 'customer' && setCustTab && custTab && (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={custTab === 'bookings'}
                onClick={() => setCustTab('bookings')}
                className={tabClass(custTab === 'bookings')}
              >
                Bookings
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={custTab === 'saved'}
                onClick={() => setCustTab('saved')}
                className={tabClass(custTab === 'saved')}
              >
                Saved
              </button>
            </>
          )}

          {role === 'manager' && setMgrTab && mgrTab && (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'bookings'}
                onClick={() => setMgrTab('bookings')}
                className={tabClass(mgrTab === 'bookings')}
              >
                Bookings
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'myVenues'}
                onClick={() => setMgrTab('myVenues')}
                className={tabClass(mgrTab === 'myVenues')}
              >
                My Venues
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'venueBookings'}
                onClick={() => setMgrTab('venueBookings')}
                className={tabClass(mgrTab === 'venueBookings')}
              >
                Venue Bookings
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'saved'}
                onClick={() => setMgrTab('saved')}
                className={tabClass(mgrTab === 'saved')}
              >
                Saved
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

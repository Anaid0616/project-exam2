'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type Role = 'customer' | 'manager';

export function tabClass(active: boolean) {
  return `
    inline-flex items-center shrink-0 snap-start
    h-9 px-3
    -mb-px leading-tight border-b-[4px]
    ${
      active
        ? 'border-coral text-ink'
        : 'border-transparent text-ink/90 hover:text-ink'
    }
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-[2px]
  `;
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
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function pushTab(next: string) {
    const q = new URLSearchParams(sp.toString());
    q.set('tab', next);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  }

  return (
    <div className={`mt-2 ${className}`}>
      <div
        role="tablist"
        aria-label="Profile sections"
        className="-mx-3 px-3 overflow-x-auto no-scrollbar whitespace-nowrap snap-x snap-mandatory md:mx-0 md:px-0 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] md:[mask-image:none] md:[-webkit-mask-image:none]"
      >
        <div className="flex gap-1">
          {role === 'customer' && setCustTab && custTab && (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={custTab === 'bookings'}
                onClick={() => {
                  setCustTab('bookings');
                  pushTab('bookings');
                }}
                className={tabClass(custTab === 'bookings')}
              >
                Bookings
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={custTab === 'saved'}
                onClick={() => {
                  setCustTab('saved');
                  pushTab('saved');
                }}
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
                onClick={() => {
                  setMgrTab('bookings');
                  pushTab('bookings');
                }}
                className={tabClass(mgrTab === 'bookings')}
              >
                Bookings
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'myVenues'}
                onClick={() => {
                  setMgrTab('myVenues');
                  pushTab('myVenues');
                }}
                className={tabClass(mgrTab === 'myVenues')}
              >
                My Venues
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'venueBookings'}
                onClick={() => {
                  setMgrTab('venueBookings');
                  pushTab('venueBookings');
                }}
                className={tabClass(mgrTab === 'venueBookings')}
              >
                Venue Bookings
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mgrTab === 'saved'}
                onClick={() => {
                  setMgrTab('saved');
                  pushTab('saved');
                }}
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

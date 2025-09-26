'use client';

import React from 'react';
import FiltersSheet from '@/features/search/FiltersSheet';
import SortMenu from '@/features/search/SortMenu';

/**
 * Row inside the header card:
 * - Filters button (mobile only, white with shadow)
 * - SortMenu (visible here on mobile; desktop Sort lives in header row)
 */
export default function HeaderActionsMobile({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* only on small screens, sits INSIDE the header panel below the texts */}
      <div className="mt-2 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-app border bg-white px-3 py-2 text-sm shadow-elev hover:bg-ink/5"
        >
          Filters
        </button>
        <SortMenu />
      </div>

      {/* Bottom sheet with your existing filter form */}
      <FiltersSheet open={open} onClose={() => setOpen(false)}>
        {children}
      </FiltersSheet>
    </>
  );
}

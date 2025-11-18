'use client';
import FiltersSheet from '@/features/search/FiltersSheet';
import VenueSearchForm from '@/features/search/VenueSearchForm';
import { useState } from 'react';

/**
 * Wrapper component that opens the mobile/tablet search sheet.
 *
 * Behavior:
 * - Renders a "Change search" button
 * - Opens a modal-like sheet (`FiltersSheet`) when clicked
 * - Displays the full `VenueSearchForm` inside the sheet
 *
 * Used primarily in mobile layouts where the main search form
 * is hidden behind an expandable UI.
 *
 * @returns {JSX.Element} The trigger button and the search sheet.
 */
export default function SearchSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-app border bg-white px-3 py-2 text-sm shadow-elev hover:bg-ink/5"
      >
        Change search
      </button>

      <FiltersSheet open={open} onClose={() => setOpen(false)}>
        <VenueSearchForm />
      </FiltersSheet>
    </>
  );
}

'use client';
import FiltersSheet from '@/features/search/FiltersSheet';
import VenueSearchForm from '@/features/search/VenueSearchForm';
import { useState } from 'react';

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

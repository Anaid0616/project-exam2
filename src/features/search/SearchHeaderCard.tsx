'use client';

import React, { useState } from 'react';
import SortMenu from '@/features/search/SortMenu';
import HeaderActionsMobile from '@/features/search/HeaderActionsMobile';
import SearchFilters from '@/features/search/SearchFilters';
import VenueSearchForm from './VenueSearchForm';
import { normalizeCountry } from '@/lib/normalizeCountry';
import { formatBookingDates } from '@/lib/date';

type Props = {
  /** Raw "where" value from the URL (unprocessed). */
  whereRaw?: string;
  /** Check-in date string (ISO or yyyy-mm-dd). */
  fromStr?: string;
  /** Check-out date string (ISO or yyyy-mm-dd). */
  toStr?: string;
  /** Number of guests in the search parameters. */
  guests?: number;
  /** Total number of search results. */
  resultCount: number;
  /** Normalized location string when using structured search. */
  loc?: string | null;
  /** Additional class names for the outer container. */
  className?: string;
  /** If true, disables the default "panel" styling. */
  unstyled?: boolean;
};

/**
 * Header card for the search results page.
 *
 * Shows:
 * - The current search summary (location, dates, guests, result count)
 * - Sorting controls (desktop)
 * - Filter + sort actions (mobile)
 * - A button to open the inline search form
 *
 * When "Change search" is clicked, the component switches into **search form mode**
 * and displays the `VenueSearchForm`. Closing the form returns back to header mode.
 *
 * @param {Props} props - Search query info and layout options.
 * @returns {JSX.Element} The header panel with summary, controls, and optional search form.
 */
export default function SearchHeaderCard({
  whereRaw,
  fromStr,
  toStr,
  guests,
  resultCount,
  loc,
  className,
  unstyled,
}: Props) {
  const [showSearchForm, setShowSearchForm] = useState(false);

  return (
    <div
      className={`${unstyled ? '' : 'panel'} ${
        className ?? ''
      } transition-all duration-300`}
    >
      {!showSearchForm ? (
        <>
          {/* --- HEADER MODE --- */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <h1 className="text-xl font-semibold">
                {loc
                  ? `Venues in ${normalizeCountry(loc)}`
                  : whereRaw
                  ? `Stays in ${whereRaw
                      .charAt(0)
                      .toUpperCase()}${whereRaw.slice(1)}`
                  : 'All venues'}
              </h1>

              <p className="text-ink/70 text-sm">
                {fromStr && toStr
                  ? formatBookingDates(fromStr, toStr)
                  : 'Any dates'}

                {guests
                  ? ` · ${guests} guest${guests > 1 ? 's' : ''}`
                  : ' · Any guests'}

                {` · ${resultCount} result${resultCount !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearchForm(true)}
                className="rounded-app border bg-white px-2.5 py-1.5 text-xs leading-none whitespace-nowrap shrink-0 sm:px-3 sm:py-2 sm:text-sm shadow-elev hover:bg-ink/5"
              >
                Change search
              </button>

              {/* Desktop sort menu */}
              <div className="hidden lg:block">
                <SortMenu />
              </div>
            </div>
          </div>

          {/* Mobile filters (Filters + SortMenu inline) */}
          <HeaderActionsMobile>
            <SearchFilters />
          </HeaderActionsMobile>
        </>
      ) : (
        <>
          {/* --- SEARCH FORM MODE --- */}
          <div className="relative">
            <VenueSearchForm onSearchEnd={() => setShowSearchForm(false)} />
            <button
              onClick={() => setShowSearchForm(false)}
              className="absolute top-0 right-2 text-ink/60 hover:text-ink"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
}

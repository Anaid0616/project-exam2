'use client';

import React, { useState } from 'react';
import SortMenu from '@/features/search/SortMenu';
import HeaderActionsMobile from '@/features/search/HeaderActionsMobile';
import SearchFilters from '@/features/search/SearchFilters';
import VenueSearchForm from './VenueSearchForm';
import { normalizeCountry } from '@/lib/normalizeCountry';

export default function SearchHeaderCard({
  whereRaw,
  fromStr,
  toStr,
  guests,
  resultCount,
  loc,
}: {
  whereRaw?: string;
  fromStr?: string;
  toStr?: string;
  guests?: number;
  resultCount: number;
  loc?: string | null;
}) {
  const [showSearchForm, setShowSearchForm] = useState(false);

  return (
    <div className="panel transition-all duration-300">
      {!showSearchForm ? (
        <>
          {/* --- HEADER MODE --- */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {loc
                  ? `Venues in ${normalizeCountry(loc)}`
                  : whereRaw
                  ? `Stays in ${whereRaw
                      .charAt(0)
                      .toUpperCase()}${whereRaw.slice(1)}`
                  : 'All venues'}
              </h2>

              <p className="text-ink/70 text-sm">
                {fromStr && toStr ? `${fromStr} – ${toStr}` : 'Any dates'}
                {guests
                  ? ` · ${guests} guest${guests > 1 ? 's' : ''}`
                  : ' · Any guests'}
                {` · ${resultCount} result${resultCount !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearchForm(true)}
                className="rounded-app border bg-white px-3 py-2 text-sm shadow-elev hover:bg-ink/5"
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
          <div className="relative p-1">
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

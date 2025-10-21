'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import VenueCard from '@/components/VenueCard';
import { listVenuesWithBookings } from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HomeVenues
 *
 * - Fetches a batch of venues and filters out test/zzz ones
 * - Shows larger cards in a smooth horizontal slider
 * - Adds desktop left/right buttons for navigation
 */
export default function HomeVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const all = await listVenuesWithBookings(40);
      const clean = (all as Venue[])
        .filter(
          (v) =>
            v?.name &&
            !/^zzz/i.test(v.name) &&
            !/^test/i.test(v.name) &&
            v.media?.[0]?.url
        )
        .sort((a, b) => {
          const ta =
            (a.updated ? Date.parse(a.updated) : 0) ||
            (a.created ? Date.parse(a.created) : 0) ||
            0;
          const tb =
            (b.updated ? Date.parse(b.updated) : 0) ||
            (b.created ? Date.parse(b.created) : 0) ||
            0;
          return tb - ta;
        })
        .slice(0, 10);

      setVenues(clean);
    }

    load();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="space-y-10 pt-12 relative">
      <h2 className="text-2xl font-semibold mb-0">Featured Venues</h2>

      {/* --- Slider --- */}
      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-ink" />
        </button>
        <div
          ref={sliderRef}
          className="grid grid-flow-col auto-cols-[minmax(290px,1fr)]  sm:auto-cols-[minmax(350px,1fr)] gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 px-2 sm:px-4"
        >
          {venues.map((v) => (
            <div key={v.id} className="snap-center">
              <VenueCard v={v} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-ink" />
        </button>

        {/* Fade edges */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-5 bg-gradient-to-r from-sand to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-5 bg-gradient-to-l from-sand to-transparent" />
      </div>

      {/* --- Button --- */}
      <div className="text-center">
        <Link
          href="/venues"
          className="btn bg-white text-ink hover:bg-ink/5 border border-ink/20"
        >
          All venues →
        </Link>
      </div>
    </section>
  );
}

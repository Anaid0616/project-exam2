'use client';

import Image from 'next/image';
import Link from 'next/link';
import VenueSearchForm from '@/features/search/VenueSearchForm';

/**
 * HomeHero Component
 *
 * Displays the top hero section on the homepage.
 * Includes a large hero image, overlayed headline + CTA,
 * and a responsive search panel that overlaps the hero slightly.
 *
 * Responsive behavior:
 * - On small screens, the panel overlaps the image more.
 * - On larger screens, spacing becomes more balanced.
 */
export default function HomeHero() {
  return (
    <section className="bleed relative">
      {/* --- Hero image --- */}
      <div className="relative h-[340px] md:h-[420px] shadow-elev">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=60&auto=format&fit=crop"
          alt="sunset at the beach"
          fill
          className="object-cover pointer-events-none"
          priority
          unoptimized
        />

        {/* --- Overlay content --- */}
        <div className="absolute inset-0 flex items-center justify-center -mb-10">
          <div className="max-w-6xl mx-auto w-full px-4 md:px-6 text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] capitalize">
              Escape to your dream destination
            </h1>

            <Link
              href="/venues"
              className="mt-6 inline-block btn btn-primary px-4 py-2 shadow-md transition-all"
            >
              Explore Venues
            </Link>
          </div>
        </div>
      </div>

      {/* --- Search panel --- */}

      <div className="flex justify-center px-2 xl:px-4 -mt-16 sm:-mt-18">
        <div className="pointer-events-auto w-[min(100%,1100px)]">
          <div
            className="
              rounded-app border shadow-elev p-4 md:p-5
              bg-white/70 supports-[backdrop-filter]:bg-white/60
              backdrop-blur-md border-white/50
            "
          >
            <VenueSearchForm
              className="!p-0 !shadow-none !border-0
                         grid gap-3
                         grid-cols-1
                         min-[420px]:grid-cols-2
                         min-[845px]:grid-cols-[1.4fr,1fr,1fr,1fr,auto]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import VenueSearchForm from '@/features/search/VenueSearchForm';

export default function HomeHero() {
  return (
    <section className="relative bleed">
      <div className="relative h-[340px] md:h-[420px] shadow-elev">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=60&auto=format&fit=crop"
          alt="sunset at the beach"
          fill
          className="object-cover pointer-events-none"
          priority
          unoptimized
        />
      </div>

      {/* Panel */}
      <div
        className="
    absolute inset-x-0
    -bottom-28               /* <= 420px */
    min-[421px]:-bottom-20     /* 421px–844px */
    min-[845px]:-bottom-14     /* >= 845px */
    z-10 flex justify-center px-4"
      >
        <div className="pointer-events-auto w-[min(100%,1150px)]">
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

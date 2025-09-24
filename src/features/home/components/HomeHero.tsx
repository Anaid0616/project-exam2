// features/home/components/HomeHero.tsx
'use client';
import Image from 'next/image';
import VenueSearchForm from '@/features/search/VenueSearchForm';

export default function HomeHero() {
  return (
    <section className="relative z-0 h-[340px] md:h-[420px] shadow-elev">
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=60&auto=format&fit=crop"
        alt=""
        fill
        className="object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-x-0 -bottom-8 z-[5] flex justify-center px-4">
        <VenueSearchForm />
      </div>
    </section>
  );
}

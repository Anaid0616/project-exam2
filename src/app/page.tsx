import { Suspense } from 'react';
import HomeHero from '@/features/home/components/HomeHero';
import HomeVenues from '@/features/home/components/HomeVenues';
import HomeDestinations from '@/features/home/components/HomeDestinations';
import VenueGridSkeleton from '@/components/skeletons/VenueGridSkeleton';

export const revalidate = 0;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 sm:space-y-10 px-2">
      {/* Hero + search */}
      <HomeHero />

      {/* Venues list */}
      <Suspense fallback={<VenueGridSkeleton count={4} />}>
        <HomeVenues />
        <HomeDestinations />
      </Suspense>
    </main>
  );
}

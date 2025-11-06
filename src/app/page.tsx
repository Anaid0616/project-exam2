import { Suspense } from 'react';
import HomeHero from '@/features/home/components/HomeHero';
import HomeVenues from '@/features/home/components/HomeVenues';
import HomeDestinations from '@/features/home/components/HomeDestinations';
import VenuesSliderSkeleton from '@/components/skeletons/VenuesSliderSkeleton';
import DestinationsSkeleton from '@/components/skeletons/DestinationsSkeleton';

export const revalidate = 0;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 sm:space-y-10 px-2">
      <HomeHero />

      {/* Featured Venues */}
      <Suspense fallback={<VenuesSliderSkeleton count={3} />}>
        <HomeVenues />
      </Suspense>

      {/* Popular Destinations */}
      <Suspense fallback={<DestinationsSkeleton count={6} />}>
        <HomeDestinations />
      </Suspense>
    </main>
  );
}

// app/loading.tsx
import HomeHero from '@/features/home/components/HomeHero';
import VenuesSliderSkeleton from '@/components/skeletons/VenuesSliderSkeleton';
import DestinationsSkeleton from '@/components/skeletons/DestinationsSkeleton';

/**
 * Route-level loading UI for the Home page (`/`).
 * Shown automatically while the page and its async children are loading.
 */
export default function LoadingHome() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 sm:space-y-10 px-2">
      <HomeHero />

      {/* Featured Venues (skeleton) */}
      <section className="space-y-6 pt-2">
        <h3 className="text-2xl font-semibold mb-0 lg:px-5">Featured Venues</h3>
        <VenuesSliderSkeleton count={6} />
      </section>

      {/* Popular Destinations (skeleton) */}
      <section className="space-y-6 pb-6">
        <h3 className="text-2xl font-semibold lg:px-5">Popular Destinations</h3>
        <DestinationsSkeleton count={6} />
      </section>
    </main>
  );
}

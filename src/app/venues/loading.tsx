import VenuesHero from '@/features/venues/components/VenuesHero';
import Skeleton from '@/components/skeletons/Skeleton';
import SearchResultsSkeleton from '@/components/skeletons/SearchResultsSkeleton';
import SearchFiltersSkeleton from '@/components/skeletons/SearchFiltersSkeleton';

export default function LoadingVenuesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      <VenuesHero />

      {/* Header skeleton */}
      <div className="relative z-10 flex justify-center -mt-8 sm:-mt-10">
        <div className="pointer-events-auto w-[min(100%,1150px)] pb-4">
          <div
            className="rounded-app border shadow-elev p-4 md:p-5
                          bg-white/70 supports-[backdrop-filter]:bg-white/60
                          backdrop-blur-md border-white/50 space-y-3"
          >
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Layout: sidebar + results */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px,1fr] mt-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <SearchFiltersSkeleton />
        </aside>

        {/* Results skeleton (grid) */}
        <section className="space-y-4">
          <SearchResultsSkeleton count={12} />
        </section>
      </div>
    </main>
  );
}

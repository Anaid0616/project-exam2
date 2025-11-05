'use client';

import Skeleton from '@/components/skeletons/ui/Skeleton';

/**
 * Skeleton for the venue details route (/venues/[id]).
 *
 * Matches the final layout:
 *  - Hero image
 *  - Content card (title, rating, location, description, amenities, policies, map)
 *  - Booking panel (price, calendar placeholder, guests, CTA)
 *
 * Use from the route's `loading.tsx`.
 */
export default function VenueDetailSkeleton() {
  return (
    <>
      {/* Top container with hero */}
      <div className="mx-auto max-w-7xl px-2 md:px-6">
        <div className="mb-2 pt-3 h-4 w-24 rounded bg-transparent" />
        <div className="overflow-hidden rounded-app">
          <Skeleton className="h-[320px] w-full md:h-[520px]" />
        </div>
      </div>

      <main className="relative z-0 -mt-10 md:-mt-14 mx-auto max-w-6xl px-2 md:px-6">
        <section className="grid gap-6 min-[900px]:grid-cols-[1fr,360px] items-start">
          {/* Content card */}
          <div className="card p-5 space-y-5">
            {/* Title + rating + location */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>

            <hr className="border-ink/10" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            {/* Policies */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>

            {/* Map */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <div className="overflow-hidden rounded-app border border-ink/10">
                <Skeleton className="h-56 w-full md:h-64" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Booking panel skeleton */}
          <aside className="min-w-0 w-full min-[900px]:sticky min-[900px]:top-24 self-start">
            <div className="panel space-y-4 p-4">
              {/* Price */}
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>

              {/* Calendar placeholder */}
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="rounded-app border border-ink/10 p-2">
                  <div className="rounded-app border border-ink/10 p-3">
                    {/* Month caption */}
                    <div className="mb-3 flex items-center justify-between">
                      <Skeleton className="h-5 w-28" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                    {/* Grid 7x6 */}
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-app" />
                  <Skeleton className="h-5 w-6" />
                  <Skeleton className="h-9 w-9 rounded-app" />
                </div>
              </div>

              {/* Total + CTA */}
              <div className="mt-1 flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-10 w-full rounded-app" />
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

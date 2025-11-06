'use client';

import Skeleton from '@/components/skeletons/Skeleton';

export default function DestinationsSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <section className="pb-6 space-y-6">
      <h3 className="text-2xl font-semibold lg:px-5">Popular Destinations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto lg:px-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-app shadow-elev"
          >
            <Skeleton className="h-[330px] w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

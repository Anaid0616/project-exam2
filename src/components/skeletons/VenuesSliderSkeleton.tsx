'use client';

import Skeleton from '@/components/skeletons/Skeleton';

export default function VenuesSliderSkeleton({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <div className="relative">
      <div className="grid grid-flow-col auto-cols-[minmax(290px,1fr)] sm:auto-cols-[minmax(350px,1fr)] gap-3 sm:gap-6 overflow-hidden pb-1 px-2 sm:px-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="snap-center card p-0 overflow-hidden">
            <Skeleton className="h-[220px] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute top-0 left-0 h-full w-5 bg-gradient-to-r from-sand to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-5 bg-gradient-to-l from-sand to-transparent" />
    </div>
  );
}

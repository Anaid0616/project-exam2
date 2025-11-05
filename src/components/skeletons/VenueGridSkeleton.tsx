'use client';

import Skeleton from '@/components/skeletons/ui/Skeleton';

export function VenueCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function VenueGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  );
}

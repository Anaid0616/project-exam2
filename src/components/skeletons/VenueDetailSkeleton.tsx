'use client';

import Skeleton from '@/components/ui/Skeleton';

export default function VenueDetailSkeleton() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="card overflow-hidden">
        <Skeleton className="h-64 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <div className="grid gap-3 md:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </main>
  );
}

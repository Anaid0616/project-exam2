'use client';

import Skeleton from '@/components/skeletons/Skeleton';

export default function SearchFiltersSkeleton() {
  return (
    <aside className="panel space-y-5">
      <h3 className="text-lg font-semibold">Filter</h3>

      {/* Price */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* label */}
        <Skeleton className="h-[6px] w-full rounded-full" /> {/* range track */}
        <Skeleton className="h-4 w-24" /> {/* “Up to …” */}
      </div>

      {/* Guests stepper */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="inline-flex items-center gap-1">
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
          ))}
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-[4px]" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Clear button */}
      <div className="pt-2">
        <Skeleton className="h-10 w-full rounded-app" />
      </div>
    </aside>
  );
}

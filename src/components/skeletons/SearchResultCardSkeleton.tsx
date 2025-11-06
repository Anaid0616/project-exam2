'use client';
import Skeleton from '@/components/skeletons/Skeleton';

export default function SearchResultCardSkeleton() {
  return (
    <article className="relative isolate overflow-hidden rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:auto-rows-auto md:grid-cols-[270px,1fr] lg:grid-cols-[310px,1fr]">
        {/* --- Bild --- */}
        <div className="relative w-full overflow-hidden rounded-2xl md:row-span-2 aspect-[16/9] md:aspect-[4/3] lg:aspect-[3/2]">
          <Skeleton className="absolute inset-0" />
          {/* “chips” (guests/country) */}
          <div className="absolute top-2 left-2 flex gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* --- Info --- */}
        <div className="space-y-2 min-w-0">
          <Skeleton className="h-5 w-2/3" /> {/* name */}
          <Skeleton className="h-4 w-24" /> {/* rating */}
          <Skeleton className="h-4 w-1/2" /> {/* location */}
          <Skeleton className="h-4 w-1/3" /> {/* date */}
          <Skeleton className="h-4 w-2/3" /> {/* amenities */}
        </div>

        {/* --- Footer (pris + knapp) --- */}
        <div className="border-t border-ink/10 pt-3 md:col-start-2 md:row-start-2 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </article>
  );
}

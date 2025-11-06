'use client';

/**
 * VenueCardSkeleton
 *
 * Matches the layout and spacing of VenueCard exactly.
 * Used for My Venues and Saved Venues skeleton loading states.
 */
export default function VenueCardSkeleton() {
  return (
    <article className="card p-3">
      {/* Image placeholder */}
      <div className="relative mb-2 w-full h-[220px] rounded-app bg-ink/10 animate-pulse" />

      {/* Name + rating row */}
      <div className="flex gap-x-2">
        <div className="h-5 w-3/4 rounded bg-ink/10 animate-pulse" />
        <div className="h-5 w-8 rounded-full bg-ink/10 animate-pulse" />
      </div>

      {/* Location + guests row */}
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="h-4 w-32 rounded bg-ink/10 animate-pulse" />
        <div className="h-4 w-20 rounded bg-ink/10 animate-pulse" />
      </div>

      {/* Price + button row */}
      <div className="mt-2 flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-ink/10 animate-pulse" />
        <div className="h-4 w-20 rounded bg-ink/10 animate-pulse" />
      </div>
    </article>
  );
}

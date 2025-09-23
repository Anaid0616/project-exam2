'use client';
export default function VenueCardSkeleton() {
  return (
    <article className="rounded-app border bg-shell p-3 shadow-elev">
      <div className="mb-3 aspect-[16/9] w-full rounded-app bg-ink/10 animate-pulse" />
      <div className="h-5 w-4/5 rounded bg-ink/10 animate-pulse" />
      <div className="mt-2 h-4 w-2/3 rounded bg-ink/10 animate-pulse" />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-ink/10 animate-pulse" />
        <div className="h-4 w-16 rounded bg-ink/10 animate-pulse" />
      </div>
    </article>
  );
}

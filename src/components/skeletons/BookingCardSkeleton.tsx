'use client';

export default function BookingCardSkeleton() {
  return (
    <article className="rounded-app border bg-shell p-3 shadow-elev">
      <div className="mb-3 aspect-[16/9] w-full rounded-app bg-ink/10 animate-pulse" />
      <div className="h-5 w-48 rounded bg-ink/10 animate-pulse" />
      <div className="mt-2 h-4 w-40 rounded bg-ink/10 animate-pulse" />
      <div className="mt-2 h-4 w-28 rounded bg-ink/10 animate-pulse" />
    </article>
  );
}

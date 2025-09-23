'use client';

import TableSkeleton from './TableSkeleton';

export default function VenueBookingsPanelSkeleton() {
  return (
    <section className="space-y-3">
      {/* filterbar */}
      <div className="panel flex flex-wrap items-end gap-3 p-3">
        <div className="flex-1 min-w-[220px]">
          <div className="mb-2 h-4 w-20 rounded-app bg-ink/10 animate-pulse" />
          <div className="h-10 rounded-app bg-ink/10 animate-pulse" />
        </div>

        <div>
          <div className="mb-2 h-4 w-24 rounded-app bg-ink/10 animate-pulse" />
          <div className="h-10 w-[180px] rounded-app bg-ink/10 animate-pulse" />
        </div>

        <div>
          <div className="mb-2 h-4 w-24 rounded-app bg-ink/10 animate-pulse" />
          <div className="h-10 w-[180px] rounded-app bg-ink/10 animate-pulse" />
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-[110px] rounded-app bg-ink/10 animate-pulse"
            />
          ))}
          <div className="h-9 w-[90px] rounded-app bg-ink/10 animate-pulse" />
        </div>
      </div>

      {/* table */}
      <TableSkeleton rows={8} withPanel />
    </section>
  );
}

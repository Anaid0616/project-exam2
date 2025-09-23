'use client';

export default function InfoCardSkeleton() {
  return (
    <header className="relative">
      {/* Banner placeholder – samma layout som InfoCard */}
      <div className="mx-auto w-full px-4">
        <div className="relative mx-auto h-56 md:h-72 bleed-small overflow-hidden rounded-app">
          <div className="h-full w-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      {/* Card placeholder – samma spacing som InfoCard */}
      <section className="panel relative mx-auto -mt-10 md:-mt-14 p-3 md:p-4">
        {/* Header rad: avatar + text + knappar */}
        <div className="flex items-start gap-4 md:items-start">
          {/* Oval avatar (vertikal), uppdragen lika mycket */}
          <div className="relative h-24 w-20 md:h-28 md:w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white -translate-y-4 md:-translate-y-10">
            <div className="h-full w-full bg-ink/10 animate-pulse" />
          </div>

          {/* Textblock */}
          <div className="min-w-0 flex-1">
            {/* Namnrad */}
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-48 rounded bg-ink/10 animate-pulse" />
              <div className="h-4 w-20 rounded bg-ink/10 animate-pulse" />
            </div>
            {/* Email + Bio */}
            <div className="mt-1 space-y-1">
              <div className="h-4 w-64 rounded bg-ink/10 animate-pulse" />
              <div className="h-4 w-40 rounded bg-ink/10 animate-pulse" />
            </div>
          </div>

          {/* Knappar (Create + Edit) */}
          <div className="ml-auto flex items-center gap-2 self-start md:self-start">
            <div className="h-10 w-32 rounded-app bg-ink/10 animate-pulse" />
            <div className="h-10 w-28 rounded-app bg-ink/10 animate-pulse" />
          </div>
        </div>

        {/* Divider + “tabs” placeholders */}
        <div className="mt-3 border-t border-ink/10 pt-1">
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 rounded bg-ink/10 animate-pulse" />
            <div className="h-8 w-24 rounded bg-ink/10 animate-pulse" />
            <div className="h-8 w-28 rounded bg-ink/10 animate-pulse" />
          </div>
        </div>
      </section>
    </header>
  );
}

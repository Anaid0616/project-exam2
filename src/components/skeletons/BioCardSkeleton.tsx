'use client';

/**
 * InfoCardSkeleton
 *
 * Loading placeholder for the user's profile header section (`InfoCard`).
 * It visually mimics the layout and dimensions of the real component
 * to prevent layout shifts (CLS) during data loading.
 *
 * Structure:
 * - Banner placeholder (same height as real banner)
 * - Panel card with avatar, text lines, and button placeholders
 * - Divider + fake "tab" buttons below
 *
 * Accessibility:
 * - Uses semantic elements (`section`, `article`) for consistency with real markup.
 * - Purely decorative, so no ARIA labels or focusable elements.
 */
export default function InfoCardSkeleton() {
  return (
    <section className="relative">
      {/* --- Banner placeholder (same height as real InfoCard banner) --- */}
      <div className="bleed overflow-hidden">
        <div className="relative z-0 mx-auto h-72 md:h-92 w-full">
          <div className="h-full w-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      {/* --- Card placeholder (matches z-index, spacing, and overlap of real card) --- */}
      <article className="panel relative z-[10] mx-auto -mt-8 md:-mt-10 p-3 md:p-4">
        {/* Header row: avatar, text blocks, and button group */}
        <div className="flex items-start gap-4 md:items-start">
          {/* Avatar circle */}
          <div className="relative h-24 w-24 md:h-28 md:w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white -translate-y-4 md:-translate-y-10">
            <div className="h-full w-full bg-ink/10 animate-pulse" />
          </div>

          {/* Text placeholder (name + email + bio lines) */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-48 rounded bg-ink/10 animate-pulse" />
              <div className="h-4 w-20 rounded bg-ink/10 animate-pulse" />
            </div>
            <div className="mt-1 space-y-1">
              <div className="h-4 w-64 rounded bg-ink/10 animate-pulse" />
              <div className="h-4 w-40 rounded bg-ink/10 animate-pulse" />
            </div>
          </div>

          {/* Action buttons (Create + Edit) */}
          <div className="ml-auto flex items-center gap-2 self-start md:self-start">
            <div className="h-10 w-32 rounded-app bg-ink/10 animate-pulse" />
            <div className="h-10 w-28 rounded-app bg-ink/10 animate-pulse" />
          </div>
        </div>

        {/* --- Divider + fake tab placeholders --- */}
        <div className="mt-3 border-t border-ink/10 pt-1">
          <div className="flex items-center gap-4 min-h-[44px]">
            <div className="h-8 w-20 rounded bg-ink/10 animate-pulse" />
            <div className="h-8 w-24 rounded bg-ink/10 animate-pulse" />
            <div className="h-8 w-28 rounded bg-ink/10 animate-pulse" />
          </div>
        </div>
      </article>
    </section>
  );
}

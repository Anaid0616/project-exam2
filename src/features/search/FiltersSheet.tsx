'use client';

import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode; // your existing <SearchFilters />
};

/**
 * Small, scrollable bottom sheet for mobile filters.
 * - Backdrop click + Esc to close
 * - Locks page scroll while open
 * - Max height ~70% of viewport; internal scroll area
 */
export default function FiltersSheet({ open, onClose, children }: Props) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* backdrop */}
      <button
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 max-h-[70vh] rounded-t-2xl bg-white shadow-xl"
      >
        {/* drag handle */}
        <div
          className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-ink/10"
          aria-hidden
        />
        {/* scroll area */}
        <div className="mt-3 max-h-[calc(70vh-3rem)] overflow-y-auto px-4 pb-4">
          {children}
        </div>
        {/* sticky footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-ink/10 bg-white px-4 py-3">
          <button
            className="rounded-xl border border-ink/10 px-4 py-2 text-sm"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded-xl bg-aegean px-4 py-2 text-sm font-medium text-white"
            onClick={onClose}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

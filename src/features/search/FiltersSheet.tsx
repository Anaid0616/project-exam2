'use client';

import React from 'react';

type Props = {
  /** Whether the sheet is open and visible. */
  open: boolean;
  /** Called when the sheet should close (Escape, backdrop click, close button). */
  onClose: () => void;
  /** Content rendered inside the sheet panel. */
  children: React.ReactNode;
};

/**
 * A modal-style sheet used for filtering results.
 *
 * Behavior:
 * - Locks body scroll while open
 * - Closes on Escape key
 * - Closes when clicking the backdrop
 * - Responsive layout: bottom sheet on mobile, centered panel on desktop
 *
 * @param {Props} props - Sheet visibility, close handler, and content.
 * @returns {JSX.Element | null} The sheet UI or `null` when closed.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
        className="
          absolute inset-x-4 bottom-8 rounded-2xl bg-white shadow-xl 
          max-h-[75vh] sm:inset-x-6 md:inset-x-12
          lg:relative lg:inset-auto lg:w-[60rem] lg:max-w-[90vw] lg:rounded-2xl lg:p-8
        "
      >
        {/* drag handle (mobile only) */}
        <div
          className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-ink/10 lg:hidden"
          aria-hidden
        />

        {/* scroll area */}
        <div className="mt-3 max-h-[calc(75vh-3rem)] overflow-y-auto px-4 pb-4 lg:max-h-none lg:overflow-visible lg:px-0">
          {children}
        </div>

        {/* close button (desktop only) */}
        <button
          onClick={onClose}
          className="lg:block absolute top-4 right-5 text-ink/60 hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

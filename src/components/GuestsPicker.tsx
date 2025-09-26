'use client';
import * as React from 'react';
import Image from 'next/image';

/**
 * Props for GuestsPicker.
 *
 * @property value     Current guests value. Use `null` to indicate "no choice yet"
 *                     so the component shows a soft placeholder (from `suggest`).
 * @property onChange  Called with a new value (or `null` when Reset is pressed).
 * @property min       Minimum allowed guests when a value is present. Default: 1.
 * @property max       Maximum allowed guests. Default: 10.
 * @property suggest   Placeholder count shown when value is `null`. Default: 2.
 * @property className Extra classes merged into the root container.
 * @property inputId   Optional id applied to the trigger <button>, so a
 *                     <label htmlFor={inputId}> associates correctly.
 */
type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  suggest?: number;
  className?: string;
  inputId?: string;
};

/**
 * GuestsPicker
 *
 * A small “stepper-in-a-popover” that behaves like a select:
 * - The trigger looks like an input.
 * - Clicking opens a small dialog with – / + controls and a live-updating count.
 * - When `value` is `null`, the trigger shows a softer placeholder using `suggest`.
 *
 * Accessibility:
 * - Trigger has `aria-haspopup="dialog"` and `aria-expanded`.
 * - Popover uses `role="dialog"` + `aria-label`.
 * - The count uses `aria-live="polite"` so screen readers hear updates.
 * - Provide `inputId` and pair it with a <label htmlFor={inputId}> outside.
 */
export default function GuestsPicker({
  value,
  onChange,
  min = 1,
  max = 10,
  suggest = 2,
  className = '',
  inputId,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close the popover on outside click or Escape
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Shown value = actual value or placeholder suggestion
  const shown = value ?? suggest;
  const isPh = value === null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger that looks like an input; label outside should use htmlFor={inputId} */}
      <button
        name="guests"
        id={inputId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="input h-11 w-full flex items-center justify-between px-4"
      >
        <span className={isPh ? 'text-ink/60' : ''}>
          {isPh ? `${suggest} guests` : `${shown} guest${shown > 1 ? 's' : ''}`}
        </span>
        <svg
          className="h-4 w-4 opacity-60"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.38a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose guests"
          className="panel absolute z-50 mt-2 w-[min(260px,90vw)] p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium">Guests</div>

            {/* Stepper controls */}
            <div className="flex items-center gap-0">
              <button
                type="button"
                aria-label="Decrease guests"
                onClick={() =>
                  value !== null && onChange(Math.max(min, value - 1))
                }
                disabled={value === null || value <= min}
                className="size-9 flex items-center justify-center disabled:opacity-40 hover:bg-ink/5"
              >
                {/* Fixed width/height prevents layout shift and silences Next/Image warnings */}
                <Image
                  src="/minus.svg"
                  alt="minus"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  aria-hidden
                />
              </button>

              <div
                aria-live="polite"
                className="min-w-[6ch] text-center font-semibold"
              >
                {shown}
              </div>

              <button
                type="button"
                aria-label="Increase guests"
                onClick={() =>
                  onChange(value === null ? suggest : Math.min(max, value + 1))
                }
                className="size-9 flex items-center justify-center hover:bg-ink/5"
              >
                <Image
                  src="/plus.svg"
                  alt="plus icon"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  aria-hidden
                />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-ink/70 hover:underline"
              onClick={() => onChange(null)} // back to placeholder state
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-primary h-9 !py-0"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

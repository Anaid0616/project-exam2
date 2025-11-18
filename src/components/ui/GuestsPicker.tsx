'use client';
import * as React from 'react';
import Image from 'next/image';

/**
 * Props for the GuestsPicker component.
 *
 * @property {number | null} value - Current number of guests, or `null` if not set yet.
 * @property {(v: number | null) - void} onChange - Callback fired whenever the guest count changes.
 * @property {number} [min=1] - Minimum allowed number of guests.
 * @property {number} [max=10] - Maximum allowed number of guests.
 * @property {number} [suggest=2] - Suggested default value when no value is selected yet.
 * @property {string} [className] - Optional additional class names for the wrapper.
 * @property {string} [inputId] - Optional ID used to associate the control with an external label.
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
 * GuestsPicker is a custom numeric picker for selecting the number of guests.
 *
 * - Renders a button-like input that opens a small dialog.
 * - Supports increment/decrement with min/max bounds.
 * - Allows resetting back to an "unset" (`null`) state.
 * - Closes on outside click and Escape key.
 *
 * @param {Props} props - Configuration for the guests picker behavior.
 * @returns {JSX.Element} The guests picker UI.
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
  const [internal, setInternal] = React.useState<number | null>(value);
  const ref = React.useRef<HTMLDivElement>(null);

  // Sync from parent → internal state
  React.useEffect(() => {
    setInternal(value);
  }, [value]);

  // Close on outside click / Escape
  React.useEffect(() => {
    const handleDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleDoc);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleDoc);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const isPh = internal === null;
  const shown = internal ?? suggest;

  const handleChange = (v: number | null) => {
    setInternal(v);
    onChange(v);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* For label association */}
      {inputId && (
        <input
          type="hidden"
          id={`${inputId}-hidden`}
          name="guests"
          value={internal ?? ''}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* Trigger */}
      <button
        id={inputId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="input h-11 w-full flex items-center justify-between px-4"
      >
        <span className={isPh ? 'text-ink/70' : ''}>
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
          className="panel absolute z-50 mt-2 w-[min(260px,90vw)] p-3 bg-white rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium">Guests</div>

            <div className="flex items-center gap-0">
              <button
                type="button"
                aria-label="Decrease guests"
                onClick={() =>
                  internal !== null && handleChange(Math.max(min, internal - 1))
                }
                disabled={internal === null || internal <= min}
                className="size-9 flex items-center justify-center disabled:opacity-40 hover:bg-ink/5"
              >
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
                  handleChange(
                    internal === null ? suggest : Math.min(max, internal + 1)
                  )
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
              onClick={() => handleChange(null)}
              className="bg-transparent border-none p-0 text-sm text-ink/70 hover:underline cursor-pointer"
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

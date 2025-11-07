'use client';

import Image from 'next/image';

type Props = {
  /** Current selected rating (1..max) or null. */
  value: number | null;
  /** Change handler for selection. */
  onChange: (v: number | null) => void;
  /** Maximum rating value (number of icons). */
  max?: number;
  /** Icon image source used for each radio. */
  iconSrc?: string;
  /** Fallback accessible label for the radio group. Prefer using groupLabelId. */
  label?: string;
  /** Id of a visible label element (e.g. a <label id="...">Rating</label>) to use with aria-labelledby. */
  groupLabelId?: string;
};

/**
 * Icon-based rating picker rendered as a radio group.
 * Accessible via either aria-labelledby (preferred) or aria-label (fallback).
 */
export default function RatingPicker({
  value,
  onChange,
  max = 5,
  iconSrc = '/logofooter.svg',
  label = 'Rating',
  groupLabelId,
}: Props) {
  const groupProps = groupLabelId
    ? { role: 'radiogroup' as const, 'aria-labelledby': groupLabelId }
    : { role: 'radiogroup' as const, 'aria-label': label };

  return (
    <div className="flex items-center gap-2">
      <div {...groupProps} className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const selected = (value ?? 0) >= n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(n)}
              className={`
                group relative h-7 w-7 rounded-full transition-transform
                ${selected ? 'scale-100 opacity-100' : 'scale-95 opacity-40'}
                hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-aegean/40
              `}
              title={`${n} of ${max}`}
              aria-label={`${n} of ${max}`}
            >
              <Image
                src={iconSrc}
                alt=""
                fill
                className="object-contain"
                sizes="28px"
                priority={false}
              />
            </button>
          );
        })}
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className="text-xs text-ink/60 hover:text-ink underline"
        aria-label="Clear rating"
      >
        Clear
      </button>

      <span
        className="ml-1 text-xs tabular-nums text-ink/60"
        aria-live="polite"
      >
        {value ?? 0}/{max}
      </span>
    </div>
  );
}

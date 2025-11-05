'use client';

import Image from 'next/image';

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  max?: number;
  iconSrc?: string;
  label?: string;
};

export default function RatingPicker({
  value,
  onChange,
  max = 5,
  iconSrc = '/logofooter.svg',
  label = 'Rating',
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <div role="radiogroup" aria-label={label} className="flex gap-2">
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
                group relative h-7 w-7 rounded-full
                transition-transform
                ${selected ? 'scale-100 opacity-100' : 'scale-95 opacity-40'}
                hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-aegean/40
              `}
              title={`${n} of ${max}`}
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
      >
        Clear
      </button>

      <span className="ml-1 text-xs tabular-nums text-ink/60">
        {value ?? 0}/5
      </span>
    </div>
  );
}

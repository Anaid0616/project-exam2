'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

type SortValue =
  | 'reco'
  | 'newest_first'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc';

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: 'reco', label: 'Recommended' },
  { value: 'newest_first', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to high' },
  { value: 'price_desc', label: 'Price: High to low' },
  { value: 'rating_desc', label: 'Rating: High to low' },
];

/**
 * Sort dropdown for the venue search results.
 *
 * Features:
 * - Displays the currently active sort option
 * - Opens a dropdown listbox with all sort choices
 * - Closes on outside click or Escape key
 * - Syncs the `sort` value into the URL (`?sort=` param)
 * - Removes the param when selecting the default "Recommended"
 *
 * Used in desktop layouts and optionally inside mobile filter panels.
 *
 * @returns {JSX.Element} A button + dropdown menu for choosing sort order.
 */
export default function SortMenu() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = (sp.get('sort') as SortValue) || 'reco';

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<SortValue>(initial);

  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [open]);

  /**
   * Applies a new sort value and syncs it to the URL.
   */
  function applySort(v: SortValue) {
    setValue(v);
    setOpen(false);

    // sync to URL (?sort=...)
    const q = new URLSearchParams(sp.toString());
    if (v === 'reco') q.delete('sort');
    else q.set('sort', v);
    router.push(`/venues?${q.toString()}`);
  }

  const label = OPTIONS.find((o) => o.value === value)?.label ?? 'Recommended';

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-app border bg-white px-3 py-1.5 shadow-elev hover:bg-ink/5"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          className="absolute right-0 z-[210] mt-2 w-60 rounded-2xl border bg-white p-1 shadow-elev"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => applySort(opt.value)}
              className={`block w-full rounded-app px-3 py-2 text-left text-sm hover:bg-sand ${
                value === opt.value ? 'bg-sand' : ''
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

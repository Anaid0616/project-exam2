'use client';

import { Wifi, Car, Coffee, PawPrint } from 'lucide-react';

/** Boolean flags for which amenities a venue offers. */
type Meta = {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

/** Visual size options for the row and icons. */
type Size = 'sm' | 'md' | 'lg';

const SIZE: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const BASE_TEXT: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-[15px]',
  lg: 'text-base',
};

type Separator = 'none' | 'dot' | 'pipe';

/**
 * Renders a compact, icon-labeled row of amenities.
 * Only amenities that are **true** in `meta` are shown; inactive ones are omitted.
 *
 * Customization:
 * - `size` controls icon/text size
 * - `gapClass` lets you define Tailwind spacing between items (default: `gap-3`)
 * - `separator` can render a small dot or pipe between items
 *
 * @example
 * ```tsx
 * // Simple row, default gap
 * <AmenitiesRow meta={{ wifi: true, breakfast: true }} />
 *
 * // Larger icons, tighter gap, with separators
 * <AmenitiesRow
 *   meta={{ wifi: true, parking: true, pets: true }}
 *   size="lg"
 *   gapClass="gap-x-4 gap-y-2"
 *   separator="dot"
 * />
 * ```
 */
export default function AmenitiesRow({
  meta,
  size = 'md',
  gapClass = 'gap-3',
  separator = 'none',
}: {
  /** Amenity booleans to display (only truthy ones render). */
  meta: Meta;
  /** Visual size for spacing and icon dimensions. */
  size?: Size;
  /** Tailwind gap classes between items (e.g. "gap-4" or "gap-x-6 gap-y-2"). */
  gapClass?: string;
  /** Optional visual separator between items. */
  separator?: Separator;
}) {
  const items = [
    { ok: !!meta.wifi, Icon: Wifi, label: 'Wi-Fi' },
    { ok: !!meta.breakfast, Icon: Coffee, label: 'Breakfast' },
    { ok: !!meta.parking, Icon: Car, label: 'Parking' },
    { ok: !!meta.pets, Icon: PawPrint, label: 'Pets' },
  ].filter((it) => it.ok); // hide inactive amenities entirely

  if (items.length === 0) return null;

  // Build children with optional separators
  const children: React.ReactNode[] = [];
  items.forEach(({ Icon, label }, idx) => {
    if (idx > 0 && separator !== 'none') {
      children.push(
        <li key={`sep-${idx}`} aria-hidden className="text-ink/30">
          {separator === 'dot' ? '•' : '|'}
        </li>
      );
    }
    children.push(
      <li key={label} className="inline-flex items-center gap-1.5">
        <Icon className={`${SIZE[size]} text-ink/90`} aria-hidden />
        <span className="text-ink/90">{label}</span>
      </li>
    );
  });

  return (
    <ul className={`flex flex-wrap ${BASE_TEXT[size]} ${gapClass}`}>
      {children}
    </ul>
  );
}

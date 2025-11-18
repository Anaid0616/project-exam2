'use client';
import Image from 'next/image';
import clsx from 'clsx';

/**
 * Supported icon size presets.
 * - `sm` → 16px
 * - `md` → 20px
 * - `lg` → 24px
 */
type Size = 'sm' | 'md' | 'lg';

/**
 * Supported display variants:
 * - `five` → Show five icons (default)
 * - `single` → Show one icon + numeric value
 */
type Variant = 'five' | 'single';

/**
 * Props for the Rating component.
 *
 * @property {number} [value=0] - Rating value from 0 to 5.
 * @property {Size} [size='sm'] - Size of the rating icons.
 * @property {boolean} [showNumber=true] - Whether to display the numeric rating value.
 * @property {string} [className] - Additional class names applied to the wrapper.
 * @property {string} [iconSrc='/logofooter.svg'] - Image source for the star/brand icon.
 * @property {Variant} [variant='five'] - Display mode: five icons or a single icon.
 * @property {0 | 1 | 2} [precision=1] - Number of decimal places for the numeric output.
 */
type Props = {
  /** Rating value, 0–5 */
  value?: number;
  /** Icon size */
  size?: Size;
  /** Show the numeric value alongside icons */
  showNumber?: boolean;
  /** Additional classes on the wrapper */
  className?: string;
  /** Source of the brand/star icon */
  iconSrc?: string;
  /** Display style: 5 icons (default) or 1 icon + number */
  variant?: Variant;
  /** Digits after the decimal point in the number */
  precision?: 1 | 0 | 2;
};

/**
 * Rating component that displays a star/brand-based rating from 0 to 5.
 *
 * Features:
 * - Clamps values between 0–5 automatically.
 * - Supports a “five star” mode or a compact “single icon + number” mode.
 * - Adjustable precision, icon size, and custom icons.
 * - Accessible: exposes rating via `aria-label`.
 *
 * @param {Props} props - Rating configuration.
 * @returns {JSX.Element} Star/brand rating UI.
 */
export default function Rating({
  value = 0,
  size = 'sm',
  showNumber = true,
  className,
  iconSrc = '/logofooter.svg',
  variant = 'five',
  precision = 1,
}: Props) {
  const clamped = Math.max(0, Math.min(5, Number(value)));
  const filled = Math.round(clamped);
  const px = { sm: 16, md: 20, lg: 24 }[size];
  const num = clamped.toFixed(precision);

  if (variant === 'single') {
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-1 align-middle',
          className
        )}
        aria-label={`${num} out of 5`}
      >
        <Image
          src={iconSrc}
          alt=""
          aria-hidden
          width={px}
          height={px}
          sizes={`${px}px`}
          className="inline-block"
          priority={false}
        />
        {showNumber && (
          <span
            className={clsx(
              size === 'lg' ? 'text-base' : 'text-sm',
              'text-ink/80'
            )}
          >
            {num}
          </span>
        )}
      </span>
    );
  }

  // Default: five icons
  return (
    <span
      className={clsx('inline-flex items-center gap-1 align-middle', className)}
      aria-label={`${num} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? 'opacity-100' : 'opacity-30'}>
          <Image
            src={iconSrc}
            alt=""
            aria-hidden
            width={px}
            height={px}
            sizes={`${px}px`}
            className="inline-block align-[-2px]"
            priority={false}
          />
        </span>
      ))}
      {showNumber && <span className="ml-1 text-ink/80">{num}</span>}
    </span>
  );
}

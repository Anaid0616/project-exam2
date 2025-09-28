'use client';
import Image from 'next/image';
import clsx from 'clsx';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'five' | 'single';

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
  /** Display style: 5 icons (default) or one icon + number */
  variant?: Variant;
  /** Digits after the decimal point in the number */
  precision?: 1 | 0 | 2;
};

const PX: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

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
  const px = PX[size];
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
              size === 'lg' ? 'text-sm' : 'text-xs',
              'text-ink/60'
            )}
          >
            {num}
          </span>
        )}
      </span>
    );
  }

  // default: five icons
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
      {showNumber && <span className="ml-1 text-xs text-ink/60">{num}</span>}
    </span>
  );
}

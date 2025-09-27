'use client';
import Image from 'next/image';
import clsx from 'clsx';

type Props = {
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
  iconSrc?: string;
};

const PX: Record<NonNullable<Props['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function Rating({
  value = 0,
  size = 'sm',
  showNumber = true,
  className,
  iconSrc = '/logofooter.svg',
}: Props) {
  const clamped = Math.max(0, Math.min(5, Number(value)));
  const filled = Math.round(clamped);
  const px = PX[size];

  return (
    <span
      className={clsx('inline-flex items-center gap-1 align-middle', className)}
      aria-label={`${clamped.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? 'opacity-100' : 'opacity-30'}>
          <Image
            src={iconSrc}
            alt="rating icons"
            aria-hidden
            width={px}
            height={px}
            sizes={`${px}px`}
            className="inline-block align-[-2px]"
            priority={false}
          />
        </span>
      ))}
      {showNumber && (
        <span className="ml-1 text-xs text-ink/60">{clamped.toFixed(1)}</span>
      )}
    </span>
  );
}

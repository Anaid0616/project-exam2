'use client';

import clsx from 'clsx';

type Props = {
  className?: string;
  rounded?: string;
};

export default function Skeleton({ className, rounded }: Props) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-ink/10',
        rounded ?? 'rounded-app',
        className
      )}
      aria-hidden
    />
  );
}

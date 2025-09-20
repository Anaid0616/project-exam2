'use client';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useUser } from '@/providers/UserProvider';

type Variant = 'overlay' | 'chip';
type Size = 'sm' | 'md' | 'lg';

export default function SaveButton({
  venueId,
  className,
  variant = 'overlay',
  size = 'lg',
  withText = false,
}: {
  venueId: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  withText?: boolean;
}) {
  const { email, ready: userReady } = useUser();
  const { has, toggle, ready } = useFavorites(email);
  const saved = has(venueId);

  if (variant === 'overlay') {
    const iconSize = size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
    return (
      <button
        type="button"
        disabled={!userReady || !ready}
        onClick={() => toggle(venueId)}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved' : 'Save venue'}
        className={`p-1 m-0 bg-transparent border-0 outline-none hover:bg-transparent focus-visible:outline-none ${
          className ?? ''
        }`}
      >
        <Heart
          strokeWidth={1.8}
          className={`
            ${iconSize}
            ${saved ? 'fill-white text-white' : 'text-white'}
            drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]
            transition-transform duration-150 hover:scale-105
          `}
        />
      </button>
    );
  }

  // “chip” style
  const chipPad = size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1';
  const chipIcon = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <button
      type="button"
      disabled={!userReady || !ready}
      onClick={() => toggle(venueId)}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save venue'}
      className={`inline-flex items-center gap-1 rounded-full ${chipPad} ${
        saved ? 'bg-primary/10 text-primary' : 'bg-ink/5 text-ink/80'
      } hover:opacity-90 focus-visible:outline-none ${className ?? ''}`}
    >
      <Heart className={`${chipIcon} ${saved ? 'fill-current' : ''}`} />
      {withText ? (saved ? 'Saved' : 'Save') : null}
    </button>
  );
}

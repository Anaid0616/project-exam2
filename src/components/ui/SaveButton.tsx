'use client';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAuth } from '@/providers/UserProvider';
import { useToast } from '@/providers/ToastProvider';

/** Visual style of the button */
type Variant = 'overlay' | 'chip';

/** Size presets */
type Size = 'sm' | 'md' | 'lg';

/** Color tone variants */
type Tone = 'white' | 'sunset' | 'ink';

/**
 * Props for the SaveButton component.
 *
 * @property {string} venueId - ID of the venue to save/unsave.
 * @property {string} [className] - Additional class names applied to the root button.
 * @property {Variant} [variant='overlay'] - Display style: overlay icon or chip-style button.
 * @property {Size} [size='lg'] - Icon/button size.
 * @property {boolean} [withText=false] - Whether to show text next to the icon (only for chip variant).
 * @property {Tone} [tone='white'] - Color tone for icon or chip background.
 * @property {string} [iconClassName] - Custom class for controlling icon size.
 */
export default function SaveButton({
  venueId,
  className,
  variant = 'overlay',
  size = 'lg',
  withText = false,
  tone = 'white',
  iconClassName,
}: {
  venueId: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  withText?: boolean;
  tone?: Tone;
  iconClassName?: string;
}) {
  const { email, ready: userReady } = useAuth(); // user auth state
  const { has, toggle, ready } = useFavorites(email); // favorites state
  const { info, error: toastError, success } = useToast(); // toast messages
  const saved = has(venueId);

  /**
   * Handles toggling the saved state for the venue.
   *
   * - If user is not logged in → shows info toast.
   * - If action succeeds → shows success toast.
   * - If action fails → shows error toast.
   *
   * @returns {Promise<void>}
   */
  async function onToggle() {
    if (!userReady) return; // still loading auth state

    if (!email) {
      info({ title: 'Sign in to save venues' });
      return;
    }

    try {
      await toggle(venueId);
      const title = saved ? 'Removed from saved' : 'Added to saved';
      success({ title });
    } catch {
      toastError({ title: 'Could not update favorites' });
    }
  }

  // overlay-style icon colors
  const overlayBase =
    tone === 'sunset'
      ? 'text-sunset'
      : tone === 'ink'
      ? 'text-ink'
      : 'text-white';

  const overlaySaved =
    tone === 'sunset'
      ? 'fill-current text-sunset'
      : tone === 'ink'
      ? 'fill-current text-ink'
      : 'fill-white text-white';

  // Overlay variant
  if (variant === 'overlay') {
    const iconSize = iconClassName ?? (size === 'lg' ? 'h-8 w-8' : 'h-6 w-6');

    return (
      <button
        type="button"
        disabled={!userReady || !ready}
        onClick={onToggle}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved' : 'Save venue'}
        className={`p-1 m-0 bg-transparent border-0 outline-none hover:bg-transparent focus-visible:outline-none ${
          className ?? ''
        }`}
      >
        <Heart
          strokeWidth={1.8}
          className={`${iconSize} ${
            saved ? overlaySaved : overlayBase
          } transition-transform duration-150 hover:scale-105`}
        />
      </button>
    );
  }

  // chip variant styling
  const chipPad = size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1';
  const chipIcon = iconClassName ?? (size === 'lg' ? 'h-5 w-5' : 'h-4 w-4');

  const chipTone =
    tone === 'sunset'
      ? 'bg-sunset/10 text-sunset'
      : tone === 'ink'
      ? saved
        ? 'bg-ink/10 text-ink'
        : 'bg-ink/5 text-ink/80'
      : saved
      ? 'bg-white text-white'
      : 'bg-ink/5 text-ink/80';

  // Chip variant UI
  return (
    <button
      type="button"
      disabled={!userReady || !ready}
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save venue'}
      className={`inline-flex items-center gap-1 rounded-full ${chipPad} ${chipTone} hover:opacity-90 focus-visible:outline-none ${
        className ?? ''
      }`}
    >
      <Heart className={`${chipIcon} ${saved ? 'fill-current' : ''}`} />
      {withText ? (saved ? 'Saved' : 'Save') : null}
    </button>
  );
}

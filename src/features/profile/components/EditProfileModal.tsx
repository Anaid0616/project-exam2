'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

export type EditProfileForm = {
  avatarUrl: string;
  bannerUrl: string;
  name: string;
  bio: string;
};

/**
 * Accessible modal dialog for editing a user profile.
 *
 * - Uses `role="dialog"` and `aria-modal="true"` for screen readers
 * - Includes Escape key and backdrop click handling
 * - Each input field has a proper label association (htmlFor ↔ id)
 * - Includes a polite aria-live region for async submit status
 */
export default function EditProfileModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Prefilled values for the form */
  initial: Partial<EditProfileForm>;
  /** Called when the form is submitted successfully */
  onSave: (values: EditProfileForm) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditProfileForm>({
    defaultValues: {
      avatarUrl: initial.avatarUrl ?? '',
      bannerUrl: initial.bannerUrl ?? '',
      name: initial.name ?? '',
      bio: initial.bio ?? '',
    },
  });

  // Reset when modal opens
  React.useEffect(() => {
    if (open) {
      reset({
        avatarUrl: initial.avatarUrl ?? '',
        bannerUrl: initial.bannerUrl ?? '',
        name: initial.name ?? '',
        bio: initial.bio ?? '',
      });
    }
  }, [open, initial, reset]);

  // ESC key closes modal
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const [statusMsg, setStatusMsg] = React.useState('');
  const statusRef = React.useRef<HTMLParagraphElement>(null);

  if (!open) return null;

  const submit = async (values: EditProfileForm) => {
    setStatusMsg('Saving profile…');
    try {
      await onSave(values);
      setStatusMsg('Profile updated.');
    } catch {
      setStatusMsg('Save failed.');
    } finally {
      requestAnimationFrame(() => statusRef.current?.focus());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-app bg-white p-5 shadow-elev">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="edit-profile-title" className="text-lg font-semibold">
            Edit Profile
          </h2>
          <button
            type="button"
            className="rounded p-1 text-ink/60 hover:bg-ink/5"
            aria-label="Close"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="grid gap-3">
          <div>
            <label htmlFor="avatarUrl" className="text-sm font-medium">
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              className="input"
              placeholder="https://..."
              {...register('avatarUrl')}
            />
          </div>

          <div>
            <label htmlFor="bannerUrl" className="text-sm font-medium">
              Banner URL
            </label>
            <input
              id="bannerUrl"
              className="input"
              placeholder="https://..."
              {...register('bannerUrl')}
            />
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              className="input"
              placeholder="Your name"
              {...register('name')}
            />
          </div>

          <div>
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              className="input min-h-24"
              placeholder="A short bio…"
              {...register('bio')}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn btn-white" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-label={isSubmitting ? 'Saving profile…' : 'Update profile'}
            >
              {isSubmitting ? 'Saving…' : 'Update Profile'}
            </button>
          </div>

          {/* Live region for async feedback */}
          <p
            ref={statusRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="text-sm text-ink/70"
          >
            {statusMsg}
          </p>
        </form>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

export type EditProfileForm = {
  avatarUrl: string;
  bannerUrl: string;
  name: string;
  bio: string;
};

export default function EditProfileModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: Partial<EditProfileForm>;
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

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (values: EditProfileForm) => {
    await onSave(values);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-app bg-white p-5 shadow-elev">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
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
          <label className="grid gap-1">
            <span className="text-sm font-medium">Avatar URL</span>
            <input
              className="input"
              placeholder="https://..."
              {...register('avatarUrl')}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Banner URL</span>
            <input
              className="input"
              placeholder="https://..."
              {...register('bannerUrl')}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Name</span>
            <input
              className="input"
              placeholder="Your name"
              {...register('name')}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Bio</span>
            <textarea
              className="input min-h-24"
              placeholder="A short bio…"
              {...register('bio')}
            />
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn btn-white" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

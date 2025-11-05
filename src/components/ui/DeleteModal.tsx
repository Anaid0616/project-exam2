// src/components/DeleteModal.tsx
'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  /** disable buttons while async action is running */
  busy?: boolean;
};

/**
 * Small, accessible confirmation modal for destructive actions.
 * Palette: shell/ink + sunset for danger action.
 */
export default function DeleteModal({
  open,
  title = 'Delete item?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  busy = false,
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const portalRef = React.useRef<HTMLDivElement | null>(null);
  const confirmBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const el = document.createElement('div');
    el.id = 'delete-modal-portal';
    document.body.appendChild(el);
    portalRef.current = el;
    return () => {
      if (portalRef.current) document.body.removeChild(portalRef.current);
      portalRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (open) setTimeout(() => confirmBtnRef.current?.focus(), 0);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && !busy && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, busy]);

  if (!mounted || !portalRef.current || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => !busy && onClose()}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-sm rounded-app border border-ink/15 bg-shell p-4 shadow-elev"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-ink/70">{description}</p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-app border border-ink/15 bg-ink/5 px-3 py-1 text-sm font-medium text-ink hover:bg-ink/10 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmBtnRef}
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center rounded-app border border-sunset bg-sunset px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-sunset/90 focus:outline-none focus:ring-2 focus:ring-sunset/40 disabled:opacity-60"
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    portalRef.current
  );
}

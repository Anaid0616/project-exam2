'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { subscribe, type Toast } from '@/lib/toast';

export default function ToastProvider() {
  const [mounted, setMounted] = useState(false);
  const portalEl = useRef<HTMLDivElement | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  // 1) Vänta tills klienten är monterad (för att undvika hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2) Skapa / fäst en separat portal-root i <body> först EFTER mount
  useEffect(() => {
    if (!mounted) return;
    const el = document.createElement('div');
    el.id = 'toast-portal';
    document.body.appendChild(el);
    portalEl.current = el;
    return () => {
      document.body.removeChild(el);
      portalEl.current = null;
    };
  }, [mounted]);

  // 3) Prenumerera på toast-events efter mount
  useEffect(() => {
    if (!mounted) return;
    return subscribe((t) => {
      setToasts((s) => [...s, t]);
      const id = window.setTimeout(() => dismiss(t.id), t.duration ?? 3500);
      timers.current[t.id] = id;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function dismiss(id: string) {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
    setToasts((s) => s.filter((x) => x.id !== id));
  }

  // Före mount finns ingen portal -> returnera null (ingen SSR/CSR-skillnad)
  if (!mounted || !portalEl.current) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex w-80 max-w-[92vw] flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
      ))}
    </div>,
    portalEl.current
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { title, description, variant = 'info' } = toast;
  const role = variant === 'error' ? 'alert' : 'status';
  const live = variant === 'error' ? 'assertive' : 'polite';
  const border =
    variant === 'success'
      ? 'border-emerald-400'
      : variant === 'error'
      ? 'border-rose-400'
      : 'border-ink/20';

  return (
    <div
      role={role}
      aria-live={live}
      className={`pointer-events-auto rounded-app border ${border} bg-sand text-ink shadow-elev`}
    >
      <div className="flex items-start gap-3 p-3">
        <Icon variant={variant} />
        <div className="flex-1">
          {title && <p className="font-semibold">{title}</p>}
          {description && (
            <p className="mt-0.5 text-sm text-ink/80">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded p-1 text-ink/60 hover:bg-ink/5 hover:text-ink"
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
    </div>
  );
}

function Icon({ variant }: { variant: 'success' | 'error' | 'info' }) {
  if (variant === 'success')
    return (
      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-emerald-600">
        <path
          d="M5 13l4 4L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  if (variant === 'error')
    return (
      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-rose-600">
        <path
          d="M12 9v4m0 4h.01M10 2l10 18H0L10 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-aegean">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 8v5m0 3h.01" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

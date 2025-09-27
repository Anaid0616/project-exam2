'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { subscribe, type Toast } from '@/lib/toast';

export default function ToastProvider() {
  const [mounted, setMounted] = useState(false);
  const portalEl = useRef<HTMLDivElement | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({}); // id -> timeoutId

  // mark client
  useEffect(() => {
    setMounted(true);
  }, []);

  // create/destroy portal node
  useEffect(() => {
    if (!mounted) return;

    const el = document.createElement('div');
    el.id = 'toast-portal';
    document.body.appendChild(el);
    portalEl.current = el;

    return () => {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
      document.body.removeChild(el);
      portalEl.current = null;
    };
  }, [mounted]);

  // stable dismiss
  const dismiss = useCallback((id: string) => {
    const t = timers.current[id];
    if (t) {
      clearTimeout(t);
      delete timers.current[id];
    }
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  // subscribe to new toasts
  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = subscribe((t) => {
      setToasts((s) => [...s, t]);
      const timeoutId = window.setTimeout(
        () => dismiss(t.id),
        t.duration ?? 3500
      );
      timers.current[t.id] = timeoutId;
    });

    return () => unsubscribe();
  }, [mounted, dismiss]);

  if (!mounted || !portalEl.current) return null;

  // Top-center container so it’s visible immediately
  return createPortal(
    <div className="fixed inset-x-0 top-4 z-[1000] flex justify-center px-2 pointer-events-none">
      <div className="flex w-full max-w-md flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </div>,
    portalEl.current
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { title, description, variant = 'info', duration = 3500 } = toast;
  const role = variant === 'error' ? 'alert' : 'status';
  const live = variant === 'error' ? 'assertive' : 'polite';

  // matchar din palett
  const styles = {
    info: { bar: 'bg-aegean', border: 'border-aegean/30', icon: 'text-aegean' },
    success: {
      bar: 'bg-lagoon',
      border: 'border-lagoon/40',
      icon: 'text-lagoon',
    },
    error: {
      bar: 'bg-sunset',
      border: 'border-sunset/40',
      icon: 'text-sunset',
    },
  } as const;
  const s = styles[variant];

  return (
    <div
      role={role}
      aria-live={live}
      className={`pointer-events-auto relative overflow-hidden rounded-app border ${s.border} bg-shell text-ink shadow-elev animate-[toast-in_150ms_ease-out]`}
    >
      {/* accentbar till vänster */}
      <div className={`absolute inset-y-0 left-0 w-1 ${s.bar}`} />

      <div className="flex items-start gap-3 p-3 pl-4">
        <Icon variant={variant} className={s.icon} />
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

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-ink/10">
        <div
          className={`${s.bar} h-full`}
          style={{
            width: '100%',
            animation: `toastProgress ${duration}ms linear forwards`,
          }}
        />
      </div>

      {/* keyframes lokalt så du slipper röra config nu */}
      <style jsx>{`
        @keyframes toast-in {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes toastProgress {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

function Icon({
  variant,
  className,
}: {
  variant: 'success' | 'error' | 'info';
  className?: string;
}) {
  const cls = `mt-0.5 h-5 w-5 ${className ?? ''}`;
  if (variant === 'success')
    return (
      <svg viewBox="0 0 24 24" className={cls}>
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
      <svg viewBox="0 0 24 24" className={cls}>
        <path
          d="M12 9v4m0 4h.01M10 2l10 18H0L10 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls}>
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

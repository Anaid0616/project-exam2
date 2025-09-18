export type ToastVariant = 'success' | 'error' | 'info';

export type ToastInput = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms (default 3500)
};

export type Toast = ToastInput & { id: string };

type Listener = (t: Toast) => void;
const listeners = new Set<Listener>();

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function emit(t: ToastInput): string {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const toast: Toast = { id, duration: 3500, variant: 'info', ...t };
  listeners.forEach((fn) => fn(toast));
  return id;
}

export const toast = {
  show: emit,
  success: (t: Omit<ToastInput, 'variant'>) =>
    emit({ ...t, variant: 'success' }),
  error: (t: Omit<ToastInput, 'variant'>) => emit({ ...t, variant: 'error' }),
  info: (t: Omit<ToastInput, 'variant'>) => emit({ ...t, variant: 'info' }),
};

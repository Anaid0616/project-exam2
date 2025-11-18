export type ToastVariant = 'success' | 'error' | 'info';

export type ToastInput = {
  /** Main message/title of the toast. */
  title?: string;
  /** Optional secondary descriptive text. */
  description?: string;
  /** Visual style of the toast. Defaults to `"info"`. */
  variant?: ToastVariant;
  /** Duration in milliseconds before auto-dismiss. Defaults to 3500 ms. */
  duration?: number;
};

export type Toast = ToastInput & { id: string };

type Listener = (t: Toast) => void;

const listeners = new Set<Listener>();

/**
 * Subscribes a listener to toast events.
 *
 * The listener will be called whenever a toast is emitted.
 *
 * @param {Listener} l - Listener callback.
 * @returns {() - void} Unsubscribe function.
 */
export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/**
 * Dispatches a toast to all subscribers.
 *
 * Generates a unique toast ID, applies defaults, and notifies listeners.
 *
 * @param {ToastInput} t - Partial toast configuration.
 * @returns {string} The generated toast ID.
 */
function emit(t: ToastInput): string {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const toast: Toast = { id, duration: 3500, variant: 'info', ...t };
  listeners.forEach((fn) => fn(toast));

  return id;
}

/**
 * Toast API for triggering UI notifications.
 *
 * - `toast.show()` – emit a custom toast
 * - `toast.success()` – success variant
 * - `toast.error()` – error variant
 * - `toast.info()` – info variant
 *
 * All helpers automatically create a unique ID and apply sensible defaults.
 */
export const toast = {
  /** Emit a toast with custom options. */
  show: emit,

  /** Emit a success toast. */
  success: (t: Omit<ToastInput, 'variant'>) =>
    emit({ ...t, variant: 'success' }),

  /** Emit an error toast. */
  error: (t: Omit<ToastInput, 'variant'>) => emit({ ...t, variant: 'error' }),

  /** Emit an informational toast. */
  info: (t: Omit<ToastInput, 'variant'>) => emit({ ...t, variant: 'info' }),
};

// src/lib/http.ts

/**
 * Custom error class for HTTP requests.
 * Carries both the HTTP status code and the parsed response body.
 */
export class HttpError<T = unknown> extends Error {
  public readonly status: number;
  public readonly body?: T;

  constructor(status: number, body?: T, message?: string) {
    super(message ?? `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Safe, typed fetch wrapper for the Holidaze API.
 *
 * Return typed answer (T).
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  opts?: { auth?: boolean; timeoutMs?: number }
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');

  const url = path.startsWith('http') ? path : `${base}${path}`;
  const ctrl = new AbortController();
  const timeoutMs = opts?.timeoutMs ?? 12000;
  const timeout = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    // Build headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': apiKey ?? '',
      ...(init.headers || {}),
    });

    // Optionally attach Bearer token
    if (opts?.auth && typeof window !== 'undefined') {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }

    // Fetch
    const res = await fetch(url, {
      ...init,
      headers,
      signal: ctrl.signal,
      cache: 'no-store',
    });

    const raw = await res.text();
    const data: T | null = raw ? safeJsonParse<T>(raw) : null;

    if (!res.ok) {
      // try read message from API
      const msg =
        (typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof (data as Record<string, unknown>).message === 'string' &&
          (data as Record<string, unknown>).message) ||
        res.statusText;

      throw new HttpError<T>(res.status, data ?? undefined, msg as string);
    }

    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    if (err instanceof HttpError) throw err;
    throw new Error('Network error — could not connect to API');
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Safely parses a JSON string.
 * Returns `null` if parsing fails instead of throwing.
 *
 * @template T
 * @param {string} text - Raw JSON string.
 * @returns {T | null} Parsed JSON or null on failure.
 */
function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

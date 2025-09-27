// lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE)
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in .env.local');

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

/** Relative paths */
export const API = {
  venues: '/holidaze/venues',
  bookings: '/holidaze/bookings',
  profiles: '/holidaze/profiles',
  auth: '/holidaze/auth',
  login: '/auth/login',
  register: '/auth/register',
} as const;

/* Converts a path or full URL to a full URL */
function toUrl(pathOrUrl: string): string {
  return /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${API_BASE}${pathOrUrl}`;
}

/** Base headers for all requests */
function baseHeaders(extra?: HeadersInit): Headers {
  const h = new Headers({
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': API_KEY,
  });
  if (extra) new Headers(extra).forEach((v, k) => h.set(k, v));
  return h;
}

function getToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return (
      localStorage.getItem('token') || localStorage.getItem('accessToken') || ''
    );
  } catch {
    return '';
  }
}

/** Typed API error with HTTP status code and optional field errors */
export class ApiError extends Error {
  status: number;
  body?: unknown;
  /** Optional map of field errors, e.g. { email: "Already taken" } */
  errors?: Record<string, string>;
  constructor(
    message: string,
    status: number,
    body?: unknown,
    errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.errors = errors;
  }
}

/** Safe JSON parse (returns undefined on invalid JSON) */
function safeParseJSON(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

/** Type guards */
function isRecord(u: unknown): u is Record<string, unknown> {
  return typeof u === 'object' && u !== null;
}

function pickString(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

function pickStringRecord(
  obj: unknown,
  key: string
): Record<string, string> | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  if (!isRecord(v)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === 'string') out[k] = val;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Simple fetch wrapper for the Holidaze API.
 * - Adds base URL and headers.
 * - Parses JSON when available.
 * - Throws ApiError on !ok with message/status/errors filled.
 */
export async function api<T>(
  pathOrUrl: string,
  init?: RequestInit
): Promise<T> {
  const url = toUrl(pathOrUrl);
  const res = await fetch(url, {
    ...init,
    headers: baseHeaders(init?.headers),
    cache: 'no-store',
  });

  // 204/205 No Content
  if (res.status === 204 || res.status === 205) return undefined as T;

  const raw = await res.text().catch(() => '');
  const json = raw ? safeParseJSON(raw) : undefined;

  if (!res.ok) {
    const message =
      pickString(json, 'message') ?? `${res.status} ${res.statusText}`;
    const errors = pickStringRecord(json, 'errors');
    throw new ApiError(message, res.status, json ?? raw, errors);
  }

  // json can be undefined if answer empty; return T|undefined
  return (json as T) ?? (undefined as T);
}

/**
 * Authenticated requests (safe in client components).
 * - Adds Bearer token from localStorage when present.
 */
export async function authApi<T>(
  pathOrUrl: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(baseHeaders(init?.headers));
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return api<T>(pathOrUrl, { ...init, headers });
}

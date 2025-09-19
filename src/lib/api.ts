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
function toUrl(pathOrUrl: string) {
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

/** Typed API error with HTTP status code */
export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/** Simple fetch wrapper for the Holidaze API */
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

  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(
      `API ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`
    );
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Requests med token – SAFE i client components */
export async function authApi<T>(
  pathOrUrl: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(baseHeaders(init?.headers));

  const token = getToken();

  if (token) headers.set('Authorization', `Bearer ${token}`);

  return api<T>(pathOrUrl, { ...init, headers });
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in .env.local');
}

export const API = {
  venues: '/holidaze/venues',
  bookings: '/holidaze/bookings',
  login: '/auth/login',
  register: '/auth/register',
  profiles: '/holidaze/profiles',
} as const;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  const res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    // Read response body to include useful error info
    const text = await res.text().catch(() => '');
    // Throw with status + body snippet
    throw new Error(
      `API ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`
    );
  }

  // Parse as JSON into the generic T
  return (await res.json()) as T;
}

export async function authApi<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return api<T>(path, { ...init, headers });
}

export function getToken() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('accessToken') || '';
  } catch {
    return '';
  }
}

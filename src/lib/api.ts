export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in .env.local');
}

export const API = {
  venues: '/holidaze/venues',
  bookings: '/holidaze/bookings',
  login: '/auth/login',
  register: '/auth/register',
} as const;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  // Normalize headers safely (Headers can be an object or a Headers instance)
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

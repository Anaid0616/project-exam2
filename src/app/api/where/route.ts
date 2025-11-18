import { NextResponse } from 'next/server';
import { searchVenues } from '@/features/venues/api/venues.api';

import type { Venue } from '@/types/venue';

/**
 * Time window for rate limiting in milliseconds (60 seconds).
 */
const WINDOW_MS = 60_000;

/**
 * Maximum number of requests allowed per IP within the time window.
 */
const LIMIT = 10;

/**
 * Simple in-memory rate limiting bucket.
 *
 * Keys are client IPs and values track:
 * - `count`: number of requests in the current window
 * - `start`: timestamp (ms) when the current window started
 */
const bucket = new Map<string, { count: number; start: number }>();

/**
 * Extracts the client IP address from the request.
 *
 * Uses the `x-forwarded-for` header when available, otherwise falls back to
 * a dummy IP (`0.0.0.0`).
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {string} The detected client IP address.
 */
function getClientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for');
  return xf?.split(',')[0] ?? '0.0.0.0';
}

/**
 * Determines whether a request from the given IP should be allowed
 * according to the in-memory rate limiter.
 *
 * If the IP has no existing record or its window has expired, a new
 * window is started and the request is allowed.
 *
 * @param {string} ip - The client IP address.
 * @returns {boolean} `true` if the request is allowed, otherwise `false`.
 */
function allow(ip: string): boolean {
  const now = Date.now();
  const rec = bucket.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    bucket.set(ip, { count: 1, start: now });
    return true;
  }
  if (rec.count < LIMIT) {
    rec.count++;
    return true;
  }
  return false;
}

/**
 * Normalizes various API response shapes into a `Venue[]`.
 *
 * Accepts either:
 * - a plain `Venue[]`, or
 * - an object with a `data` property containing `Venue[]`
 *
 * Any other shape results in an empty array.
 *
 * @param {unknown} x - The raw value returned from `searchVenues`.
 * @returns {Venue[]} A list of venues, or an empty array if it cannot be unwrapped.
 */
function unwrapVenueList(x: unknown): Venue[] {
  if (Array.isArray(x)) return x as Venue[];
  if (x && typeof x === 'object' && 'data' in x) {
    const d = (x as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Venue[];
  }
  return [];
}

/**
 * Handles GET requests for venue search autocomplete suggestions.
 *
 * - Applies per-IP rate limiting.
 * - Reads the `q` query parameter (search term).
 * - Ignores queries shorter than 2 characters.
 * - Fetches venues via `searchVenues`.
 * - Builds a unique list of text suggestions based on city, country and venue name.
 * - Prioritizes suggestions starting with the query (or word-start matches),
 *   followed by suggestions that merely contain the query.
 * - Returns up to 10 results as a JSON array of strings.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} A JSON response containing suggestion strings or an error status.
 */
export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (!allow(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();

  // Skip searching for 0–1 characters
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  // Fetch venues and unwrap regardless of response shape
  const raw = await searchVenues(q, { limit: 30 });
  const venues = unwrapVenueList(raw);

  // Build unique text suggestions
  const seenLc = new Set<string>();
  const all: string[] = [];
  const add = (s?: string | null) => {
    const v = s?.trim();
    if (!v) return;
    const lc = v.toLowerCase();
    if (seenLc.has(lc)) return;
    seenLc.add(lc);
    all.push(v);
  };

  for (const v of venues) {
    add(v.location?.city);
    add(v.location?.country);
    if (v.location?.city && v.location?.country)
      add(`${v.location.city}, ${v.location.country}`);
    add(v.name);
  }

  // Filter out the exact text the user typed
  const qlc = q.toLowerCase();
  const withoutExact = all.filter((s) => s.toLowerCase() !== qlc);

  // Prioritize prefix / word-start matches, then "contains" matches
  const starts = withoutExact.filter((s) => {
    const lc = s.toLowerCase();
    return (
      lc.startsWith(qlc) || lc.split(/[\s,]+/).some((w) => w.startsWith(qlc))
    );
  });
  const inc = withoutExact.filter((s) => {
    const lc = s.toLowerCase();
    return lc.includes(qlc) && !starts.includes(s);
  });

  // Sort shorter first, then alphabetically
  starts.sort((a, b) => a.length - b.length || a.localeCompare(b));
  inc.sort((a, b) => a.length - b.length || a.localeCompare(b));

  // Max 10 for dropdown
  const results = [...starts, ...inc].slice(0, 10);

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' },
  });
}

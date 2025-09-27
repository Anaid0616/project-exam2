import { NextResponse } from 'next/server';
import { searchVenues } from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';

const WINDOW_MS = 60_000;
const LIMIT = 10;
const bucket = new Map<string, { count: number; start: number }>();

function getClientIp(req: Request) {
  const xf = req.headers.get('x-forwarded-for');
  return xf?.split(',')[0] ?? '0.0.0.0';
}
function allow(ip: string) {
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

function unwrapVenueList(x: unknown): Venue[] {
  if (Array.isArray(x)) return x as Venue[];
  if (x && typeof x === 'object' && 'data' in x) {
    const d = (x as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Venue[];
  }
  return [];
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (!allow(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();

  // Låt bli att söka på 0–1 tecken
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  // Hämta venues och packa upp oavsett svar-omslag
  const raw = await searchVenues(q, { limit: 30 });
  const venues = unwrapVenueList(raw);

  // ... venues → bygg unika textförslag i Set<string> som du redan gör:
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

  // Filtrera bort exakt det användaren skrivit
  const qlc = q.toLowerCase();
  const withoutExact = all.filter((s) => s.toLowerCase() !== qlc);

  // Prioritera prefix/ordstart → sedan “innehåller”
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

  // Sortera kortare först, sedan alfabetiskt
  starts.sort((a, b) => a.length - b.length || a.localeCompare(b));
  inc.sort((a, b) => a.length - b.length || a.localeCompare(b));

  // Max 10 for dropdown
  const results = [...starts, ...inc].slice(0, 10);

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' },
  });
}

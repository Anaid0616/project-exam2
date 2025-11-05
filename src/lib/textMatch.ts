// src/lib/textMatch.ts
import type { VenueWithBookings } from '@/types/venue';

/** Normalize */
export function normalizePlain(s: string): string {
  return (
    s
      .normalize('NFD')
      // remove accents
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()
  );
}

/** Levenshtein */
export function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  const dp: number[][] = Array.from({ length: la + 1 }, () =>
    Array<number>(lb + 1).fill(0)
  );

  for (let i = 0; i <= la; i++) dp[i][0] = i;
  for (let j = 0; j <= lb; j++) dp[0][j] = j;

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // delete
        dp[i][j - 1] + 1, // insert
        dp[i - 1][j - 1] + cost // substitute
      );
    }
  }
  return dp[la][lb];
}

/**
 * Fuzzy match: checks if `query` is approximately included in `text`
 * 1)   Direct inclusion
 * 2)   Word-level fuzzy match (Levenshtein distance)
 */
export function fuzzyIncludes(
  text: string,
  query: string,
  maxDistance: number = 2
): boolean {
  if (!text || !query) return false;
  if (text.includes(query)) return true;

  const words = text.split(/\s+/).filter(Boolean);
  for (const w of words) {
    if (Math.abs(w.length - query.length) > maxDistance) continue;
    if (levenshtein(w, query) <= maxDistance) return true;
  }
  return false;
}

/**  */
export function matchVenueTerm(
  v: Pick<VenueWithBookings, 'name' | 'location'>,
  rawQuery: string,
  maxDistance: number = 2
): boolean {
  const hay = normalizePlain(
    `${v.name ?? ''} ${v.location?.city ?? ''} ${v.location?.country ?? ''}`
  );
  const q = normalizePlain(rawQuery);

  return hay.includes(q) || fuzzyIncludes(hay, q, maxDistance);
}

// src/lib/textMatch.ts
import type { VenueWithBookings } from '@/types/venue';

/**
 * Normalizes a string for plain-text matching:
 * - Unicode NFD normalization
 * - Removes diacritics (accents)
 * - Lowercases
 * - Trims whitespace
 *
 * Useful for case-insensitive and accent-insensitive comparison.
 *
 * @param {string} s - Input string.
 * @returns {string} Normalized string.
 */
export function normalizePlain(s: string): string {
  return (
    s
      .normalize('NFD')
      // Remove accents
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()
  );
}

/**
 * Computes the Levenshtein distance between two strings.
 * Measures the minimum number of edits required to transform one string
 * into the other (insert, delete, substitute).
 *
 * @param {string} a - First string.
 * @param {string} b - Second string.
 * @returns {number} The edit distance.
 */
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
 * Fuzzy match: checks whether `query` is approximately contained in `text`.
 *
 * Matching rules:
 * 1. Direct substring match (`text.includes(query)`)
 * 2. Word-level fuzzy match using Levenshtein distance
 *
 * Useful for forgiving user input search (typos, small mistakes).
 *
 * @param {string} text - Normalized text to search in.
 * @param {string} query - Normalized query string.
 * @param {number} [maxDistance=2] - Maximum allowed edit distance.
 * @returns {boolean} True if the query fuzzily matches the text.
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

/**
 * Checks if a venue matches a search term using normalized
 * substring matching and fuzzy matching.
 *
 * Fields included in the searchable text:
 * - venue name
 * - city
 * - country
 *
 * @param {Pick<VenueWithBookings, 'name' | 'location'>} v - Venue data.
 * @param {string} rawQuery - Raw search term entered by the user.
 * @param {number} [maxDistance=2] - Max allowed distance for fuzzy matching.
 * @returns {boolean} True if the venue approximately matches the query.
 */
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

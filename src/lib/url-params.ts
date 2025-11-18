export type Sp = Record<string, string | string[] | undefined>;

/**
 * Returns the first value if the input is an array,
 * otherwise returns the value as-is.
 *
 * Useful for working with frameworks (e.g., Next.js or Node query params)
 * that may provide single or multiple values per parameter.
 *
 * @param {string | string[] | undefined} v - Input value.
 * @returns {string | undefined} The first element, or the original string.
 */
export function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Returns the last value if the input is an array,
 * otherwise returns the value as-is.
 *
 * @param {string | string[] | undefined} v - Input value.
 * @returns {string | undefined} The last element, or the original string.
 */
export function last(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[v.length - 1] : v;
}

/**
 * Safely parses a number from a string with fallback.
 *
 * Works like `Number(v) ?? def`, but treats empty strings as missing values
 * and does not return `NaN`. If parsing fails, returns the provided default.
 *
 * @param {string | undefined} v - String to convert.
 * @param {number} def - Fallback value if parsing fails.
 * @returns {number} Parsed number or the fallback.
 */
export function int(v: string | undefined, def: number): number {
  if (v == null || v === '') return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

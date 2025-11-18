import type { JwtPayload } from '@/types/venue';

/**
 * Decodes a JWT token payload without verifying its signature.
 *
 * This function:
 * - extracts the middle segment of the JWT
 * - fixes URL-safe base64 characters
 * - applies required padding
 * - decodes and parses the JSON payload
 *
 * If decoding fails (malformed token), it returns `null`.
 *
 * @param {string} token - The raw JWT string.
 * @returns {JwtPayload | null} The decoded payload object, or `null` on failure.
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/**
 * Formats a number as EUR currency using British English formatting rules.
 *
 * Example:
 * ```ts
 * money(149); // "€149"
 * ```
 *
 * @param {number} n - The numeric amount.
 * @returns {string} A formatted currency string.
 */
export const money = (n: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

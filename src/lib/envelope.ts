// src/lib/envelope.ts

import type { ApiEnvelope, MaybeEnvelope } from '@/types/venue';

/**
 * Type guard that determines whether a response is wrapped in an API envelope.
 *
 * The Holidaze API may return:
 * - `{ data: T }` (envelope)
 * - `T` directly (no envelope)
 *
 * This helper allows you to safely detect and unwrap the response shape.
 *
 * @param {MaybeEnvelope<T>} res - The API response to test.
 * @returns {res is ApiEnvelope<T>} True if the value contains a `data` property.
 */
export function isEnvelope<T>(res: MaybeEnvelope<T>): res is ApiEnvelope<T> {
  return typeof res === 'object' && res !== null && 'data' in res;
}

/**
 * Extracts the data from an API envelope or returns the raw value
 * if no envelope is present.
 *
 * Useful for APIs that inconsistently wrap their responses.
 *
 * @param {MaybeEnvelope<T>} res - The API response, with or without envelope.
 * @returns {T} The unwrapped data.
 */
export function unwrap<T>(res: MaybeEnvelope<T>): T {
  return isEnvelope(res) ? res.data : (res as T);
}

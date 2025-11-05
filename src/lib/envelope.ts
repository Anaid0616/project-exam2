// src/lib/envelope.ts
import type { ApiEnvelope, MaybeEnvelope } from '@/types/venue';

export function isEnvelope<T>(res: MaybeEnvelope<T>): res is ApiEnvelope<T> {
  return typeof res === 'object' && res !== null && 'data' in res;
}

export function unwrap<T>(res: MaybeEnvelope<T>): T {
  return isEnvelope(res) ? res.data : (res as T);
}

export type Sp = Record<string, string | string[] | undefined>;

/** Första värdet om array, annars värdet. */
export function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Sista värdet om array, annars värdet. */
export function last(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[v.length - 1] : v;
}

/** Number(v) med fallback; samma som Number(x)||def men säkrare för tomma värden. */
export function int(v: string | undefined, def: number): number {
  if (v == null || v === '') return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

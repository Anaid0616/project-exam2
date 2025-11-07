export function invariant(
  cond: unknown,
  msg = 'Invariant failed'
): asserts cond {
  if (!cond) throw new Error(msg);
}

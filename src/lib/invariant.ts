/**
 * Runtime assertion utility.
 *
 * Throws an error if the given condition is falsy.
 * When the condition passes, TypeScript narrows the type of `cond`
 * using the `asserts cond` return type.
 *
 * Commonly used to enforce assumptions inside functions:
 * ```ts
 * invariant(user, "User must be loaded");
 * // user is now guaranteed to be non-null
 * ```
 *
 * @param {unknown} cond - The condition to assert.
 * @param {string} [msg='Invariant failed'] - Error message used when the condition is falsy.
 * @throws {Error} If the condition is falsy.
 */
export function invariant(
  cond: unknown,
  msg = 'Invariant failed'
): asserts cond {
  if (!cond) throw new Error(msg);
}

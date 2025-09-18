/**
 * Transforms for react-hook-form + yup
 * - toNum: to convert strings to numbers, but empty strings to undefined
 * - emptyStrToUndef: to convert empty strings to undefined
 */
export function toNum(value: unknown, original: unknown) {
  if (original === '' || original === null) return undefined;
  if (typeof original === 'string' && original.trim() === '') return undefined;
  return value;
}

/** Empty string -> undefined */
export function emptyStrToUndef(value: unknown, original: unknown) {
  return typeof original === 'string' && original.trim() === ''
    ? undefined
    : value;
}

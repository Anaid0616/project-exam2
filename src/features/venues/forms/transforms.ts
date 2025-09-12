export const toNum = (value: unknown, original: unknown) =>
  original === '' || original === null ? undefined : value;

export const emptyStrToUndef = (value: unknown, original: unknown) =>
  typeof original === 'string' && original.trim() === '' ? undefined : value;

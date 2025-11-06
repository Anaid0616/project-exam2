// Convert a Date to ISO 8601 in UTC
export const toIsoUtc = (d: Date) =>
  new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    )
  ).toISOString();

// Get YYYY-MM-DD from ISO string
export const toDateOnly = (iso: string) => iso.slice(0, 10);

/* Calculate number of nights between two dates
 * from and to are ISO strings (date or full)
 * returns number of nights (0 if invalid range)
 */
export function nightsBetween(from: string, to: string) {
  const a = new Date(toIsoUtc(new Date(from)));
  const b = new Date(toIsoUtc(new Date(to)));
  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

/* Format a date range for display in English
 * Example output: "10 Nov 2025 → 16 Nov 2025"
 */
export function formatDateRange(fromIso: string, toIso: string) {
  const from = new Date(fromIso);
  const to = new Date(toIso);

  const opts: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  // Force English regardless of user/browser locale
  const fmt = new Intl.DateTimeFormat('en-GB', opts);
  return `${fmt.format(from)} → ${fmt.format(to)}`;
}

/* Full display format with nights count
 * Example output: "10 Nov 2025 → 16 Nov 2025 (6 nights)"
 */
export function formatBookingDates(fromIso: string, toIso: string) {
  return `${formatDateRange(fromIso, toIso)} (${nightsBetween(
    fromIso,
    toIso
  )} nights)`;
}

// Utility function to calculate the number of nights between two dates
export function nightsBetween(from: string, to: string) {
  const a = new Date(from);
  const b = new Date(to);
  const d = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
}

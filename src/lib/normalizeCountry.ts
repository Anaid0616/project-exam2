/**
 * Normalize common localized country names to English.
 * Used for consistent filtering and display across the app.
 */
export function normalizeCountry(country: string): string {
  const map: Record<string, string> = {
    norge: 'Norway',
    sverige: 'Sweden',
    danmark: 'Denmark',
    suomi: 'Finland',
    island: 'Iceland',
    españa: 'Spain',
    italia: 'Italy',
    deutschland: 'Germany',
    frankrike: 'France',
  };

  const key = country.trim().toLowerCase();
  const normalized = map[key] ?? country;

  // Capitalize first letter for display (optional)
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

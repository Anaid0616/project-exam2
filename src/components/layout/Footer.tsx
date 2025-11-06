import Link from 'next/link';
import Image from 'next/image';
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiKlarna,
} from 'react-icons/si';

/**
 * Footer
 *
 * A responsive site footer with:
 * - Left: quick links (Profile, Contact)
 * - Center: circular brand mark
 * - Right: accepted payment icons
 *
 * Responsiveness & alignment:
 * - On small screens, all sections are centered and stacked in a single column.
 * - From `md:` upwards, the layout switches to a 3-column grid:
 *   left-aligned links, centered logo, right-aligned payment icons.
 *
 * Accessibility:
 * - Uses semantic <footer>.
 * - Payment icons include `aria-label` for screen readers.
 *
 * Styling notes:
 * - Thin top divider uses the brand color `bg-aegean`.
 * - Bottom bar shows the current year and brand name.
 */
export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Thin top divider in brand color */}
      <div className="h-4 bg-aegean" />

      <div className="bg-white">
        <div
          className="
          mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8
          items-center text-center
          md:grid-cols-3 md:text-left
        "
        >
          {/* Left: links (center on mobile, left on md+) */}
          <div className="space-y-2 justify-self-center md:justify-self-start">
            <h3 className="font-semibold">Holidaze</h3>
            <ul className="space-y-1 text-sm text-ink/70">
              <li>
                <Link href="/profile" className="hover:underline">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Center: circular logo */}
          <div className="flex justify-center md:justify-center">
            <Image
              src="/logofooter.svg"
              alt="Holidaze mark"
              width={56}
              height={56}
              className="h-14 w-14 rounded-app"
            />
          </div>

          {/* Right: payment icons (center on mobile, right on md+) */}
          <div className="justify-self-center md:justify-self-end">
            <h3 className="mb-2 font-semibold md:text-right">Payments</h3>
            <div
              className="
              flex flex-wrap items-center justify-center gap-4 text-ink/70
              md:justify-end
            "
            >
              <SiKlarna aria-label="Klarna" className="h-8 w-10 text-ink" />
              <SiVisa aria-label="Visa" className="h-8 w-10 text-ink" />
              <SiMastercard
                aria-label="Mastercard"
                className="h-8 w-10 text-ink"
              />
              <SiAmericanexpress
                aria-label="American Express"
                className="h-8 w-10 text-ink"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-aegean py-3 text-center text-xs text-white">
        © {new Date().getFullYear()} HOLIDAZE
      </div>
    </footer>
  );
}

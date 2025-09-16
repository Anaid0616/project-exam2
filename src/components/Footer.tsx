import Link from 'next/link';
import Image from 'next/image';
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiKlarna,
} from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* thin top divider in your teal */}
      <div className="h-4 bg-aegean" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 md:grid-cols-3">
        {/* Left: links */}
        <div className="space-y-2">
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

        {/* Center: circular logo (your SVG in /public) */}
        <div className="flex justify-center">
          <Image
            src="/logofooter.svg"
            alt="Holidaze mark"
            width={56}
            height={56}
            className="rounded-app w-14 h-14"
          />
        </div>

        {/* Right: payment icons */}
        <div className="md:justify-self-end">
          <h3 className="mb-2 font-semibold">Payments</h3>
          <div className="flex items-center gap-4 text-ink/70">
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

      {/* bottom bar */}
      <div className="bg-aegean py-3 text-center text-xs text-white">
        © {new Date().getFullYear()} HOLIDAZE
      </div>
    </footer>
  );
}

import type { Booking, JwtPayload, Venue, VenueBooking } from '@/types/venue';

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export const money = (n: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

/* Mock-data – byt mot fetch senare */
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    venueName: 'Santorini Hotel Resort',
    when: '15–20 Aug',
    total: 340,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=60&auto=format&fit=crop',
  },
  {
    id: 'b2',
    venueName: 'Beachfront Bungalow',
    when: '1–4 Sep',
    total: 210,
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60&auto=format&fit=crop',
  },
];

export const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Seaside apartment',
    price: 120,
    maxGuests: 2, // ← lägg till
    meta: {}, // ← lägg till (tomt funkar om dina fält i Meta är optional)
    location: { city: 'Santorini', country: 'Greece' },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=60&auto=format&fit=crop',
        alt: 'Seaside apartment',
      },
    ],
  },
  {
    id: 'v2',
    name: 'Cliffside Villa',
    price: 340,
    maxGuests: 4, // ← lägg till
    meta: {}, // ← lägg till
    location: { city: 'Oia', country: 'Greece' },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=60&auto=format&fit=crop',
        alt: 'Cliffside Villa',
      },
    ],
  },
];

export const MOCK_VENUE_BOOKINGS: VenueBooking[] = [
  {
    id: 'vb1',
    venueName: 'Santorini Hotel Resort',
    guestName: 'M. Johansson',
    checkIn: '2025-08-12',
    checkOut: '2025-08-15',
    nights: 3,
    guests: 2,
    total: 240,
    status: 'Completed',
  },
  {
    id: 'vb2',
    venueName: 'Oia Sea Apartments',
    guestName: 'V. Persson',
    checkIn: '2025-09-05',
    checkOut: '2025-09-10',
    nights: 5,
    guests: 2,
    total: 420,
    status: 'Pending',
  },
  {
    id: 'vb3',
    venueName: 'Beachfront Bungalow',
    guestName: 'P. Andersen',
    checkIn: '2025-09-18',
    checkOut: '2025-09-21',
    nights: 3,
    guests: 2,
    total: 240,
    status: 'Canceled',
  },
  {
    id: 'vb4',
    venueName: 'Aegean Village',
    guestName: 'D. Bergelin',
    checkIn: '2025-10-01',
    checkOut: '2025-10-07',
    nights: 6,
    guests: 2,
    total: 520,
    status: 'Upcoming',
  },
];

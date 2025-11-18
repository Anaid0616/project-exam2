// src/types/booking.ts

/**
 * Minimal booking range (used for availability checks).
 * Dates use the ISO `YYYY-MM-DD` format.
 */
export type BookedLite = {
  dateFrom: string; // ISO YYYY-MM-DD
  dateTo: string; // ISO YYYY-MM-DD
};

/**
 * Full booking record used in venue-owner views
 * (e.g., VenueBookingsTable and VenueBookingsPanel).
 */
export type VenueBooking = {
  id: string;
  venueName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number; // EUR
  status: 'Upcoming' | 'Pending' | 'Completed' | 'Canceled';
};

/** View-model used by BookingCard in profile */
export type BookingLite = {
  id: string;
  venueId?: string;
  venueName: string;
  dateFrom?: string;
  dateTo?: string;
  when?: string;
  total: number; // EUR
  image?: string;
  location?: string;
  guests?: number;
  nights?: number; // legacy; not needed if dateFrom/dateTo provided
};

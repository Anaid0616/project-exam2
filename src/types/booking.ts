// src/types/booking.ts
export type BookedLite = {
  dateFrom: string; // ISO YYYY-MM-DD
  dateTo: string; // ISO YYYY-MM-DD
};

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

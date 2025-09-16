/* --- Types --- */
export type Media = {
  url: string;
  alt?: string | null;
};

export type Meta = {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

export type Location = {
  city?: string | null;
  country?: string | null;
  zip?: string | null;
};

export type Owner = {
  name?: string | null;
  email?: string | null;
};

export type Venue = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  maxGuests: number;
  media: Media[];
  meta: Meta;
  location?: Location;
  rating?: number;
  owner?: Owner;
};

export type JwtPayload = {
  email?: string;
  name?: string;
  venueManager?: boolean;
  [k: string]: unknown;
};

export type Profile = {
  name: string;
  email: string;
  bio?: string | null;
  avatar?: Media | null;
  banner?: Media | null;
  venueManager: boolean;
};

export type Booking = {
  id: string;
  venueName: string;
  when: string;
  total: number; // EUR
  image?: string;
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

/* --- API--- */
export type VenueListResponse = { data: Venue[] };
export type VenueResponse = Venue | { data: Venue };

/* helper */
export function toVenue(input: VenueResponse): Venue {
  return 'data' in input ? input.data : input;
}

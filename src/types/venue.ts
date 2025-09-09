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
};

/* --- API--- */
export type VenueListResponse = { data: Venue[] };
export type VenueResponse = Venue | { data: Venue };

/* helper */
export function toVenue(input: VenueResponse): Venue {
  return 'data' in input ? input.data : input;
}

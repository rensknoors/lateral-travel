export type CurrencyCode = "EUR";

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export type DateRange = {
  checkIn: string;
  checkOut: string;
};

export const STAY_CATEGORIES = [
  "apartment",
  "boutique-hotel",
  "cabin",
  "guesthouse",
] as const;
export type StayCategory = (typeof STAY_CATEGORIES)[number];

export const STAY_AMENITIES = [
  "breakfast",
  "coffee",
  "coworking-space",
  "desk",
  "kitchen",
  "late-checkout",
  "parking",
  "pet-friendly",
  "quiet-zone",
  "washer",
  "wifi",
] as const;
export type StayAmenity = (typeof STAY_AMENITIES)[number];

export const STAY_SORT_OPTIONS = [
  "recommended",
  "price-asc",
  "price-desc",
  "rating",
] as const;
export type StaySortOption = (typeof STAY_SORT_OPTIONS)[number];

export const DESK_TYPES = [
  "dedicated-desk",
  "dining-table",
  "coworking-space",
] as const;
export type DeskType = (typeof DESK_TYPES)[number];

export type WorkSetup = {
  deskType: DeskType;
  wifiMbps: number;
  quietScore: number;
  hasMonitor: boolean;
};

export type StaySummary = {
  id: string;
  name: string;
  category: StayCategory;
  location: string;
  country: string;
  tagline: string;
  imageUrls: string[];
  pricePerNight: Money;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  amenities: StayAmenity[];
  workSetup: WorkSetup;
  isFavorited: boolean;
  isSuperhost: boolean;
  isNew: boolean;
};

export type Stay = StaySummary & {
  description: string;
  bedrooms: number;
  bathrooms: number;
  checkInTime: string;
  checkOutTime: string;
  policies: string[];
};

export type StayListFilters = {
  query?: string;
  location?: string;
  category?: StayCategory;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: StayAmenity[];
  sort?: StaySortOption;
};

export type StayFavoriteUpdate = {
  isFavorited: boolean;
};

export type StayListResponse = {
  stays: StaySummary[];
  total: number;
  filters: StayListFilters;
};

export type AvailabilityRequest = DateRange & {
  stayId: string;
  guests: number;
};

export type AvailabilityQuoteInput = Omit<AvailabilityRequest, "stayId"> & {
  stay: Stay;
};

export type AvailabilityQuote = AvailabilityRequest & {
  isAvailable: boolean;
  nights: number;
  nightlyRate: Money;
  subtotal: Money;
  serviceFee: Money;
  total: Money;
  unavailableReason?: string;
};

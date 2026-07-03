import type {
  AvailabilityQuote,
  AvailabilityQuoteInput,
  Money,
  Stay,
  StayListFilters,
  StaySortOption,
  StaySummary,
} from "@/features/stays/types/stay";

const DAY_IN_MS = 86_400_000;
const SERVICE_FEE_RATE = 0.12;

const money = (amount: number, currency: Money["currency"] = "EUR"): Money => ({
  amount: Math.round(amount * 100) / 100,
  currency,
});

const normalize = (value: string) => value.trim().toLowerCase();

const includesNormalized = (value: string, query: string) =>
  normalize(value).includes(normalize(query));

export const toStaySummary = (stay: Stay): StaySummary => {
  const {
    description: _description,
    imageUrls: _imageUrls,
    bedrooms: _bedrooms,
    bathrooms: _bathrooms,
    checkInTime: _checkInTime,
    checkOutTime: _checkOutTime,
    policies: _policies,
    ...summary
  } = stay;

  return summary;
};

export const filterStays = (stays: Stay[], filters: StayListFilters = {}) =>
  stays.filter((stay) => {
    const matchesQuery =
      !filters.query ||
      [
        stay.name,
        stay.location,
        stay.country,
        stay.tagline,
        stay.description,
        stay.category,
      ].some((value) => includesNormalized(value, filters.query ?? ""));

    const matchesLocation =
      !filters.location || includesNormalized(stay.location, filters.location);
    const matchesGuests = !filters.guests || stay.maxGuests >= filters.guests;
    const matchesMinPrice =
      filters.minPrice === undefined || stay.pricePerNight.amount >= filters.minPrice;
    const matchesMaxPrice =
      filters.maxPrice === undefined || stay.pricePerNight.amount <= filters.maxPrice;
    const matchesAmenities =
      !filters.amenities?.length ||
      filters.amenities.every((amenity) => stay.amenities.includes(amenity));

    return (
      matchesQuery &&
      matchesLocation &&
      matchesGuests &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesAmenities
    );
  });

export const sortStays = (
  stays: Stay[],
  sort: StaySortOption = "recommended",
) => {
  const sortedStays = [...stays];

  if (sort === "price-asc") {
    return sortedStays.sort((first, second) => first.pricePerNight.amount - second.pricePerNight.amount);
  }

  if (sort === "price-desc") {
    return sortedStays.sort((first, second) => second.pricePerNight.amount - first.pricePerNight.amount);
  }

  if (sort === "rating") {
    return sortedStays.sort((first, second) => second.rating - first.rating);
  }

  return sortedStays.sort(
    (first, second) =>
      second.rating - first.rating ||
      second.reviewCount - first.reviewCount ||
      second.workSetup.quietScore - first.workSetup.quietScore,
  );
};

export const calculateNightCount = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);

  return Math.max(
    0,
    Math.round((checkOutDate.getTime() - checkInDate.getTime()) / DAY_IN_MS),
  );
};

export const calculateSubtotal = (stay: Stay, nights: number) =>
  money(stay.pricePerNight.amount * nights, stay.pricePerNight.currency);

export const calculateServiceFee = (subtotal: Money, isAvailable: boolean) =>
  money(isAvailable ? subtotal.amount * SERVICE_FEE_RATE : 0, subtotal.currency);

export const calculateTotalPrice = (subtotal: Money, serviceFee: Money) =>
  money(subtotal.amount + serviceFee.amount, subtotal.currency);

export const calculateAvailabilityQuote = ({
  stay,
  checkIn,
  checkOut,
  guests,
}: AvailabilityQuoteInput): AvailabilityQuote => {
  const nights = calculateNightCount(checkIn, checkOut);
  const isAvailable = nights > 0 && guests <= stay.maxGuests;
  const subtotal = calculateSubtotal(stay, nights);
  const serviceFee = calculateServiceFee(subtotal, isAvailable);

  return {
    stayId: stay.id,
    checkIn,
    checkOut,
    guests,
    isAvailable,
    nights,
    nightlyRate: stay.pricePerNight,
    subtotal,
    serviceFee,
    total: calculateTotalPrice(subtotal, serviceFee),
    unavailableReason: isAvailable ? undefined : "Selected dates or guest count are unavailable.",
  };
};

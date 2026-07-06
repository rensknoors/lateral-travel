import {
  STAY_AMENITIES,
  STAY_CATEGORIES,
  STAY_SORT_OPTIONS,
  type StayAmenity,
  type StayCategory,
  type StayListFilters,
  type StaySortOption,
} from "@/features/stays/types/stay";

const parseNumberParam = (value: string | null) => {
  if (!value) return undefined;
  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : undefined;
};

const parseAmenitiesParam = (value: string | null): StayAmenity[] | undefined => {
  if (!value) return undefined;

  const amenities = value
    .split(",")
    .map((amenity) => amenity.trim())
    .filter((amenity): amenity is StayAmenity =>
      STAY_AMENITIES.includes(amenity as StayAmenity),
    );

  return amenities.length ? amenities : undefined;
};

const parseSortParam = (value: string | null): StaySortOption | undefined =>
  STAY_SORT_OPTIONS.includes(value as StaySortOption) ? (value as StaySortOption) : undefined;

const parseCategoryParam = (value: string | null): StayCategory | undefined =>
  STAY_CATEGORIES.includes(value as StayCategory) ? (value as StayCategory) : undefined;

export const parseStayListFilters = (searchParams: URLSearchParams): StayListFilters => ({
  query: searchParams.get("query") ?? undefined,
  location: searchParams.get("location") ?? undefined,
  category: parseCategoryParam(searchParams.get("category")),
  guests: parseNumberParam(searchParams.get("guests")),
  minPrice: parseNumberParam(searchParams.get("minPrice")),
  maxPrice: parseNumberParam(searchParams.get("maxPrice")),
  amenities: parseAmenitiesParam(searchParams.get("amenities")),
  sort: parseSortParam(searchParams.get("sort")),
});

export const hasActiveStayFilters = (filters: StayListFilters) =>
  Boolean(
    filters.query ||
    filters.location ||
    filters.category ||
    filters.guests ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.amenities?.length ||
    (filters.sort && filters.sort !== "recommended"),
  );

import { http, HttpResponse } from "msw";

import {
  STAY_AMENITIES,
  STAY_SORT_OPTIONS,
  type Stay,
  type StayAmenity,
  type StayListFilters,
  type StaySortOption,
} from "@/features/stays/types/stay";
import { notFound } from "@/mocks/handlers/helpers";
import {
  getAvailabilityQuote,
  getStayById,
  listStays,
} from "@/mocks/repositories/stay-repository";

const getNumberParam = (url: URL, name: string) => {
  const value = url.searchParams.get(name);

  return value ? Number(value) : undefined;
};

const parseAmenities = (url: URL): StayAmenity[] | undefined => {
  const amenities = url.searchParams
    .get("amenities")
    ?.split(",")
    .filter((amenity): amenity is StayAmenity =>
      STAY_AMENITIES.includes(amenity as StayAmenity),
    );

  return amenities?.length ? amenities : undefined;
};

const parseSort = (url: URL): StaySortOption | undefined => {
  const sort = url.searchParams.get("sort");

  return STAY_SORT_OPTIONS.includes(sort as StaySortOption)
    ? (sort as StaySortOption)
    : undefined;
};

const parseStayListFilters = (url: URL): StayListFilters => ({
  query: url.searchParams.get("query") ?? undefined,
  location: url.searchParams.get("location") ?? undefined,
  guests: getNumberParam(url, "guests"),
  minPrice: getNumberParam(url, "minPrice"),
  maxPrice: getNumberParam(url, "maxPrice"),
  amenities: parseAmenities(url),
  sort: parseSort(url),
});

export const stayHandlers = [
  http.get("*/api/stays", ({ request }) => {
    const filters = parseStayListFilters(new URL(request.url));

    return HttpResponse.json(listStays(filters));
  }),

  http.get("*/api/stays/:stayId", ({ params }) => {
    const stay = getStayById(String(params.stayId));

    if (!stay) {
      return notFound("Stay not found.");
    }

    return HttpResponse.json<Stay>(stay);
  }),

  http.get("*/api/stays/:stayId/availability", ({ params, request }) => {
    const stayId = String(params.stayId);
    const url = new URL(request.url);
    const quote = getAvailabilityQuote({
      stayId,
      checkIn: url.searchParams.get("checkIn") ?? "",
      checkOut: url.searchParams.get("checkOut") ?? "",
      guests: Number(url.searchParams.get("guests") ?? "1"),
    });

    if (!quote) {
      return notFound("Stay not found.");
    }

    return HttpResponse.json(quote);
  }),
];

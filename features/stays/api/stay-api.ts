import { apiFetch } from "@/lib/api/client";
import type {
  AvailabilityQuote,
  Stay,
  StayListFilters,
  StayListResponse,
} from "@/features/stays/types/stay";

const buildStayListSearchParams = (filters?: StayListFilters) => {
  const params = new URLSearchParams();

  if (!filters) {
    return params;
  }

  if (filters.query) params.set("query", filters.query);
  if (filters.location) params.set("location", filters.location);
  if (filters.guests) params.set("guests", String(filters.guests));
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","));
  if (filters.sort) params.set("sort", filters.sort);

  return params;
};

export const getStays = (filters?: StayListFilters) => {
  const params = buildStayListSearchParams(filters);
  const query = params.toString();

  return apiFetch<StayListResponse>(query ? `/api/stays?${query}` : "/api/stays");
};

export const getStay = (stayId: string) => apiFetch<Stay>(`/api/stays/${stayId}`);

export const getAvailability = (
  stayId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
) => {
  const params = new URLSearchParams({
    checkIn,
    checkOut,
    guests: String(guests),
  });

  return apiFetch<AvailabilityQuote>(
    `/api/stays/${stayId}/availability?${params.toString()}`,
  );
};

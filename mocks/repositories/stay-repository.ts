import type {
  AvailabilityQuote,
  AvailabilityRequest,
  StayListFilters,
  StayListResponse,
} from "@/features/stays/types/stay";
import {
  calculateAvailabilityQuote,
  filterStays,
  sortStays,
  toStaySummary,
} from "@/features/stays/domain/stay-service";
import { mockStays } from "@/mocks/stays";

export const listStays = (filters: StayListFilters = {}): StayListResponse => {
  const stays = sortStays(filterStays(mockStays, filters), filters.sort).map(toStaySummary);

  return {
    stays,
    total: stays.length,
    filters,
  };
};

export const getStayById = (stayId: string) =>
  mockStays.find((stay) => stay.id === stayId);

export const setStayFavorite = (stayId: string, isFavorited: boolean) => {
  const stay = getStayById(stayId);

  if (!stay) {
    return undefined;
  }

  stay.isFavorited = isFavorited;

  return toStaySummary(stay);
};

export const getAvailabilityQuote = ({
  stayId,
  checkIn,
  checkOut,
  guests,
}: AvailabilityRequest): AvailabilityQuote | undefined => {
  const stay = getStayById(stayId);

  if (!stay) {
    return undefined;
  }

  return calculateAvailabilityQuote({
    stay,
    checkIn,
    checkOut,
    guests,
  });
};

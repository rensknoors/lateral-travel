"use client";

import { useQuery } from "@tanstack/react-query";

import { getAvailability, getStay, getStays } from "@/features/stays/api/stay-api";
import type { StayListFilters } from "@/features/stays/types/stay";

export const stayQueryKeys = {
  all: ["stays"] as const,
  list: (filters?: StayListFilters) => [...stayQueryKeys.all, "list", filters] as const,
  detail: (stayId: string) => [...stayQueryKeys.all, "detail", stayId] as const,
  availability: (stayId: string, checkIn: string, checkOut: string, guests: number) =>
    [...stayQueryKeys.all, "availability", stayId, checkIn, checkOut, guests] as const,
};

export const useStaysQuery = (filters?: StayListFilters) =>
  useQuery({
    queryKey: stayQueryKeys.list(filters),
    queryFn: () => getStays(filters),
  });

export const useStayQuery = (stayId: string) =>
  useQuery({
    queryKey: stayQueryKeys.detail(stayId),
    queryFn: () => getStay(stayId),
    enabled: Boolean(stayId),
  });

export const useAvailabilityQuery = (
  stayId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  enabled = true,
) =>
  useQuery({
    queryKey: stayQueryKeys.availability(stayId, checkIn, checkOut, guests),
    queryFn: () => getAvailability(stayId, checkIn, checkOut, guests),
    enabled: enabled && Boolean(stayId && checkIn && checkOut && guests > 0),
  });

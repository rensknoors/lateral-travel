"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAvailability,
  getStay,
  getStays,
  setStayFavorite,
} from "@/features/stays/api/stay-api";
import type {
  Stay,
  StayListFilters,
  StayListResponse,
  StaySummary,
} from "@/features/stays/types/stay";

export const stayQueryKeys = {
  all: ["stays"] as const,
  lists: () => [...stayQueryKeys.all, "list"] as const,
  list: (filters?: StayListFilters) => [...stayQueryKeys.lists(), filters] as const,
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

export const useSetStayFavoriteMutation = () => {
  const queryClient = useQueryClient();

  const applyFavorite = (stays: StaySummary[], updated: StaySummary) =>
    stays.map((stay) =>
      stay.id === updated.id ? { ...stay, isFavorited: updated.isFavorited } : stay,
    );

  return useMutation({
    mutationFn: ({ stayId, isFavorited }: { stayId: string; isFavorited: boolean }) =>
      setStayFavorite(stayId, isFavorited),
    onSuccess: (updatedStay) => {
      queryClient.setQueriesData<StayListResponse>(
        { queryKey: stayQueryKeys.lists() },
        (data) => data && { ...data, stays: applyFavorite(data.stays, updatedStay) },
      );
      queryClient.setQueryData<Stay>(
        stayQueryKeys.detail(updatedStay.id),
        (stay) => stay && { ...stay, isFavorited: updatedStay.isFavorited },
      );
    },
  });
};

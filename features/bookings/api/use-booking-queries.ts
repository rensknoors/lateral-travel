"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { createBooking, getBooking } from "@/features/bookings/api/booking-api";
import type { CreateBookingRequest } from "@/features/bookings/types/booking";

export const bookingQueryKeys = {
  all: ["bookings"] as const,
  detail: (bookingId: string) => [...bookingQueryKeys.all, bookingId] as const,
};

export const useCreateBookingMutation = () =>
  useMutation({
    mutationFn: (request: CreateBookingRequest) => createBooking(request),
  });

export const useBookingQuery = (bookingId: string) =>
  useQuery({
    queryKey: bookingQueryKeys.detail(bookingId),
    queryFn: () => getBooking(bookingId),
    enabled: Boolean(bookingId),
  });

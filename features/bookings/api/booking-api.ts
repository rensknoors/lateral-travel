import { apiFetch } from "@/lib/api/client";
import type { Booking, CreateBookingRequest } from "@/features/bookings/types/booking";

export const createBooking = (request: CreateBookingRequest) =>
  apiFetch<Booking>("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

export const getBooking = (bookingId: string) =>
  apiFetch<Booking>(`/api/bookings/${bookingId}`);

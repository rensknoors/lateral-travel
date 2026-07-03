import { http, HttpResponse } from "msw";

import type { Booking, CreateBookingRequest } from "@/features/bookings/types/booking";
import { notFound } from "@/mocks/handlers/helpers";
import {
  createBooking,
  getBookingById,
} from "@/mocks/repositories/booking-repository";

export const bookingHandlers = [
  http.post("*/api/bookings", async ({ request }) => {
    const body = (await request.json()) as CreateBookingRequest;
    const booking = createBooking(body);

    if (!booking) {
      return notFound("Stay not found.");
    }

    return HttpResponse.json<Booking>(booking, { status: 201 });
  }),

  http.get("*/api/bookings/:bookingId", ({ params }) => {
    const booking = getBookingById(String(params.bookingId));

    if (!booking) {
      return notFound("Booking not found.");
    }

    return HttpResponse.json<Booking>(booking);
  }),
];

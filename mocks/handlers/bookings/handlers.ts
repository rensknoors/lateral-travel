import { http, HttpResponse } from "msw";

import type { Booking, CreateBookingRequest } from "@/features/bookings/types/booking";
import { bookingsById } from "@/mocks/bookings";
import { createBooking } from "@/mocks/factories";
import { createAvailabilityQuote, getStay, notFound } from "@/mocks/handlers/helpers";

export const bookingHandlers = [
  http.post("*/api/bookings", async ({ request }) => {
    const body = (await request.json()) as CreateBookingRequest;
    const stay = getStay(body.stayId);

    if (!stay) {
      return notFound("Stay not found.");
    }

    const quote = createAvailabilityQuote(stay, body.checkIn, body.checkOut, body.guests);
    const booking = createBooking(body, quote);

    bookingsById.set(booking.id, booking);

    return HttpResponse.json<Booking>(booking, { status: 201 });
  }),

  http.get("*/api/bookings/:bookingId", ({ params }) => {
    const booking = bookingsById.get(String(params.bookingId));

    if (!booking) {
      return notFound("Booking not found.");
    }

    return HttpResponse.json<Booking>(booking);
  }),
];

import type { CreateBookingRequest } from "@/features/bookings/types/booking";
import { createBooking as createMockBooking } from "@/mocks/factories";
import { bookingsById } from "@/mocks/bookings";
import { getAvailabilityQuote } from "@/mocks/repositories/stay-repository";

export const createBooking = (request: CreateBookingRequest) => {
  const quote = getAvailabilityQuote(request);

  if (!quote) {
    return undefined;
  }

  const booking = createMockBooking(request, quote);

  bookingsById.set(booking.id, booking);

  return booking;
};

export const getBookingById = (bookingId: string) => bookingsById.get(bookingId);

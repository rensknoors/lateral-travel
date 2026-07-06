import { describe, expect, it } from "vitest";

import { createBooking, getBooking } from "@/features/bookings/api/booking-api";
import type { CreateBookingRequest } from "@/features/bookings/types/booking";
import { getAvailability, getStay, getStays } from "@/features/stays/api/stay-api";
import { ApiError } from "@/lib/api-client/api-client";

const CHECK_IN = "2026-08-10";
const CHECK_OUT = "2026-08-14";

const createBookingRequest = (
  stayId: string,
  overrides?: Partial<CreateBookingRequest>,
): CreateBookingRequest => ({
  stayId,
  checkIn: CHECK_IN,
  checkOut: CHECK_OUT,
  guests: 1,
  guest: { fullName: "Maria Remote", email: "maria@example.com" },
  paymentMethod: "mock-card",
  ...overrides,
});

describe("booking flow through the mock API", () => {
  it("completes browse -> detail -> availability -> checkout -> confirmation", async () => {
    // Browse: the seeded list is the entry point for the whole journey.
    const { stays } = await getStays();
    expect(stays.length).toBeGreaterThan(0);

    // Detail: the stay page fetches the full record by id.
    const stay = await getStay(stays[0].id);
    expect(stay.id).toBe(stays[0].id);

    // Availability: a valid selection produces a bookable quote.
    const quote = await getAvailability(stay.id, CHECK_IN, CHECK_OUT, 1);
    expect(quote.isAvailable).toBe(true);
    expect(quote.nights).toBe(4);
    expect(quote.total.amount).toBeCloseTo(
      quote.subtotal.amount + quote.serviceFee.amount,
      2,
    );

    // Checkout: booking creation re-quotes server-side with the same inputs.
    const booking = await createBooking(createBookingRequest(stay.id));
    expect(booking.status).toBe("confirmed");
    expect(booking.reference).toBeTruthy();
    expect(booking.total).toEqual(quote.total);

    // Confirmation: the booking is retrievable by the id the redirect uses.
    const confirmation = await getBooking(booking.id);
    expect(confirmation).toEqual(booking);
  });

  it("quotes as unavailable when the guest count exceeds capacity", async () => {
    const { stays } = await getStays();

    const quote = await getAvailability(stays[0].id, CHECK_IN, CHECK_OUT, 99);

    expect(quote.isAvailable).toBe(false);
    expect(quote.unavailableReason).toBeTruthy();
  });

  it("rejects a booking for an unknown stay with a 404", async () => {
    const attempt = createBooking(createBookingRequest("missing-stay"));

    await expect(attempt).rejects.toBeInstanceOf(ApiError);
    await expect(attempt).rejects.toMatchObject({ status: 404 });
  });

  it("returns a 404 for an unknown booking confirmation", async () => {
    await expect(getBooking("missing-booking")).rejects.toMatchObject({
      status: 404,
    });
  });
});

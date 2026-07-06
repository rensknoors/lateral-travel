import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { BookingConfirmation } from "@/features/bookings/components/booking-confirmation";
import type { Booking } from "@/features/bookings/types/booking";
import type { AvailabilityQuote, Stay } from "@/features/stays/types/stay";
import { server } from "@/mocks/server";
import { renderWithQueryClient } from "@/tests/render-with-query-client";

const stay: Stay = {
  id: "harbor-loft",
  name: "Harbor Loft",
  category: "apartment",
  location: "Lisbon",
  country: "Portugal",
  tagline: "Bright loft with a river view.",
  imageUrls: ["/img/one.jpg"],
  pricePerNight: { amount: 180, currency: "EUR" },
  rating: 4.8,
  reviewCount: 120,
  maxGuests: 3,
  amenities: ["wifi", "desk"],
  workSetup: {
    deskType: "dedicated-desk",
    wifiMbps: 400,
    quietScore: 92,
    hasMonitor: true,
  },
  isFavorited: false,
  isSuperhost: false,
  isNew: false,
  description: "A bright loft overlooking the river.",
  bedrooms: 1,
  bathrooms: 1,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  policies: ["Mock payment only"],
};

const quote: AvailabilityQuote = {
  stayId: "harbor-loft",
  checkIn: "2026-07-10",
  checkOut: "2026-07-12",
  guests: 2,
  isAvailable: true,
  nights: 2,
  nightlyRate: { amount: 180, currency: "EUR" },
  subtotal: { amount: 360, currency: "EUR" },
  serviceFee: { amount: 43.2, currency: "EUR" },
  total: { amount: 403.2, currency: "EUR" },
};

const booking: Booking = {
  id: "booking-123",
  reference: "LT-BOOKIN",
  status: "confirmed",
  createdAt: "2026-07-02T12:00:00.000Z",
  stayId: "harbor-loft",
  checkIn: "2026-07-10",
  checkOut: "2026-07-12",
  guests: 2,
  guest: {
    fullName: "Rens Knoors",
    email: "rens@example.com",
  },
  paymentMethod: "mock-card",
  quote,
  total: quote.total,
};

describe("BookingConfirmation", () => {
  it("shows the booking reference, stay, dates, guests, and total", async () => {
    server.use(
      http.get("*/api/bookings/:bookingId", () =>
        HttpResponse.json<Booking>(booking),
      ),
      http.get("*/api/stays/:stayId", () => HttpResponse.json<Stay>(stay)),
    );

    renderWithQueryClient(<BookingConfirmation bookingId="booking-123" />);

    expect(await screen.findByText("LT-BOOKIN")).toBeVisible();
    expect(screen.getByText("Harbor Loft")).toBeVisible();
    expect(screen.getByText("Jul 10, 2026 - Jul 12, 2026")).toBeVisible();
    expect(screen.getByText("2 guests")).toBeVisible();
    expect(screen.getByText("€403")).toBeVisible();
  });
});

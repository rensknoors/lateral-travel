import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { StayAvailabilityPanel } from "@/features/stays/components/stay-availability-panel";
import type { AvailabilityQuote, Stay } from "@/features/stays/types/stay";
import { buildCheckoutUrl } from "@/features/stays/utils/build-checkout-url";
import { buildGuestLabels } from "@/features/stays/utils/build-guest-labels";
import { isValidBookingSelection } from "@/features/stays/utils/is-valid-booking-selection";
import { server } from "@/mocks/server";
import { renderWithQueryClient } from "@/tests/render-with-query-client";

const createStay = (overrides?: Partial<Stay>): Stay => ({
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
  ...overrides,
});

const mockAvailabilityQuote = (overrides?: Partial<AvailabilityQuote>) => {
  server.use(
    http.get("*/api/stays/:stayId/availability", () =>
      HttpResponse.json<AvailabilityQuote>({
        stayId: "harbor-loft",
        checkIn: "2026-07-10",
        checkOut: "2026-07-12",
        guests: 1,
        isAvailable: true,
        nights: 2,
        nightlyRate: { amount: 180, currency: "EUR" },
        subtotal: { amount: 360, currency: "EUR" },
        serviceFee: { amount: 43, currency: "EUR" },
        total: { amount: 403, currency: "EUR" },
        ...overrides,
      }),
    ),
  );
};

const selectValidDates = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Check-in"), "2026-07-10");
  await user.type(screen.getByLabelText("Check-out"), "2026-07-12");
};

describe("isValidBookingSelection", () => {
  it("requires check-in, check-out, and guests", () => {
    expect(isValidBookingSelection("", "2026-07-12", 2)).toBe(false);
    expect(isValidBookingSelection("2026-07-10", "", 2)).toBe(false);
    expect(isValidBookingSelection("2026-07-10", "2026-07-12", 0)).toBe(false);
  });

  it("rejects check-out on or before check-in", () => {
    expect(isValidBookingSelection("2026-07-10", "2026-07-10", 2)).toBe(false);
    expect(isValidBookingSelection("2026-07-12", "2026-07-10", 2)).toBe(false);
  });

  it("accepts a valid date range and guest count", () => {
    expect(isValidBookingSelection("2026-07-10", "2026-07-12", 2)).toBe(true);
  });
});

describe("buildCheckoutUrl", () => {
  it("builds the checkout query string", () => {
    expect(buildCheckoutUrl("harbor-loft", "2026-07-10", "2026-07-12", 2)).toBe(
      "/checkout?stayId=harbor-loft&checkIn=2026-07-10&checkOut=2026-07-12&guests=2",
    );
  });
});

describe("StayAvailabilityPanel", () => {
  it("disables reserve until dates are valid", async () => {
    const user = userEvent.setup();
    mockAvailabilityQuote();

    renderWithQueryClient(<StayAvailabilityPanel stay={createStay()} />);

    expect(screen.getByRole("button", { name: "Reserve" })).toBeDisabled();

    await selectValidDates(user);

    expect(
      await screen.findByRole("link", { name: "Reserve" }),
    ).toHaveAttribute(
      "href",
      "/checkout?stayId=harbor-loft&checkIn=2026-07-10&checkOut=2026-07-12&guests=1",
    );
  });

  it("caps guest options at the stay maximum", () => {
    expect(Object.keys(buildGuestLabels(2))).toEqual(["1", "2"]);
    expect(buildGuestLabels(2)["2"]).toBe("2 guests");
  });

  it("shows the price breakdown once a quote comes back available", async () => {
    const user = userEvent.setup();
    mockAvailabilityQuote();

    renderWithQueryClient(<StayAvailabilityPanel stay={createStay()} />);
    await selectValidDates(user);

    expect(await screen.findByText("Total")).toBeInTheDocument();
    expect(screen.getByText("€403")).toBeInTheDocument();
    expect(screen.getByText("€360")).toBeInTheDocument();
    expect(screen.getByText("€43")).toBeInTheDocument();
  });

  it("disables reserve and explains why when the stay is unavailable", async () => {
    const user = userEvent.setup();
    mockAvailabilityQuote({
      isAvailable: false,
      unavailableReason: "Fully booked for these dates.",
    });

    renderWithQueryClient(<StayAvailabilityPanel stay={createStay()} />);
    await selectValidDates(user);

    expect(
      await screen.findByText("Fully booked for these dates."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve" })).toBeDisabled();
  });

  it("shows a retry action when the availability check fails", async () => {
    const user = userEvent.setup();
    server.use(
      http.get("*/api/stays/:stayId/availability", () =>
        HttpResponse.json(
          { error: { code: "not-found", message: "Stay not found." } },
          { status: 404 },
        ),
      ),
    );

    renderWithQueryClient(<StayAvailabilityPanel stay={createStay()} />);
    await selectValidDates(user);

    expect(
      await screen.findByText("Couldn't check availability"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve" })).toBeDisabled();
  });
});

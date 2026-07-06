import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { StayAvailabilityPanel } from "@/features/stays/components/stay-availability-panel";
import { buildCheckoutUrl } from "@/features/stays/utils/build-checkout-url";
import { buildGuestLabels } from "@/features/stays/utils/build-guest-labels";
import { isValidBookingSelection } from "@/features/stays/utils/is-valid-booking-selection";
import type { Stay } from "@/features/stays/types/stay";

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

    render(<StayAvailabilityPanel stay={createStay()} />);

    expect(screen.getByRole("button", { name: "Reserve" })).toBeDisabled();

    await user.type(screen.getByLabelText("Check-in"), "2026-07-10");
    await user.type(screen.getByLabelText("Check-out"), "2026-07-12");

    expect(screen.getByRole("link", { name: "Reserve" })).toHaveAttribute(
      "href",
      "/checkout?stayId=harbor-loft&checkIn=2026-07-10&checkOut=2026-07-12&guests=1",
    );
  });

  it("caps guest options at the stay maximum", () => {
    expect(Object.keys(buildGuestLabels(2))).toEqual(["1", "2"]);
    expect(buildGuestLabels(2)["2"]).toBe("2 guests");
  });
});

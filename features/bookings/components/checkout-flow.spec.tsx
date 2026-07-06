import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";

import { CheckoutFlow } from "@/features/bookings/components/checkout-flow";
import type { Booking, CreateBookingRequest } from "@/features/bookings/types/booking";
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

const mockCheckoutDependencies = () => {
  server.use(
    http.get("*/api/stays/:stayId", () => HttpResponse.json<Stay>(stay)),
    http.get("*/api/stays/:stayId/availability", () =>
      HttpResponse.json<AvailabilityQuote>(quote),
    ),
    http.post("*/api/bookings", () =>
      HttpResponse.json<Booking>(booking, { status: 201 }),
    ),
  );
};

const renderCheckout = (onBookingCreated = vi.fn<(bookingId: string) => void>()) => {
  renderWithQueryClient(
    <CheckoutFlow
      stayId="harbor-loft"
      checkIn="2026-07-10"
      checkOut="2026-07-12"
      guests={2}
      onBookingCreated={onBookingCreated}
    />,
  );

  return { onBookingCreated };
};

const completeRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(await screen.findByLabelText("Full name"), "Rens Knoors");
  await user.type(screen.getByLabelText("Email"), "rens@example.com");
  await user.click(screen.getByLabelText(/I agree to the booking terms/i));
};

describe("CheckoutFlow", () => {
  it.each([
    {
      stayId: "harbor-loft",
      checkIn: "2026-07-12",
      checkOut: "2026-07-10",
      guests: 2,
    },
    {
      stayId: "",
      checkIn: "2026-07-10",
      checkOut: "2026-07-12",
      guests: 2,
    },
    {
      stayId: "harbor-loft",
      checkIn: "not-a-date",
      checkOut: "2026-07-12",
      guests: 2,
    },
    {
      stayId: "harbor-loft",
      checkIn: "2026-07-10",
      checkOut: "2026-07-12",
      guests: Number.NaN,
    },
  ])("shows a recovery state when checkout params are invalid", (params) => {
    renderWithQueryClient(
      <CheckoutFlow
        stayId={params.stayId}
        checkIn={params.checkIn}
        checkOut={params.checkOut}
        guests={params.guests}
      />,
    );

    expect(screen.getByText("Choose valid dates")).toBeVisible();
    expect(screen.getByRole("link", { name: "Return to stays" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("validates guest details and terms before creating a booking", async () => {
    const user = userEvent.setup();
    mockCheckoutDependencies();
    renderCheckout();

    await user.click(await screen.findByRole("button", { name: "Complete booking" }));

    expect(await screen.findByText("Full name is required.")).toBeVisible();
    expect(screen.getByText("Enter a valid email address.")).toBeVisible();
    expect(screen.getByText("Accept the terms to continue.")).toBeVisible();
    expect(screen.getByLabelText("Full name")).toHaveFocus();
  });

  it("creates a booking and redirects to confirmation", async () => {
    const user = userEvent.setup();
    let bookingRequest: CreateBookingRequest | undefined;
    mockCheckoutDependencies();
    server.use(
      http.post("*/api/bookings", async ({ request }) => {
        bookingRequest = (await request.json()) as CreateBookingRequest;

        return HttpResponse.json<Booking>(booking, { status: 201 });
      }),
    );
    const { onBookingCreated } = renderCheckout();

    await completeRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Complete booking" }));

    await waitFor(() => expect(onBookingCreated).toHaveBeenCalledWith("booking-123"));
    expect(bookingRequest).toEqual({
      stayId: "harbor-loft",
      checkIn: "2026-07-10",
      checkOut: "2026-07-12",
      guests: 2,
      guest: {
        fullName: "Rens Knoors",
        email: "rens@example.com",
      },
      paymentMethod: "mock-card",
    });
  });

  it("shows a recoverable error when booking creation fails", async () => {
    const user = userEvent.setup();
    mockCheckoutDependencies();
    server.use(
      http.post("*/api/bookings", () =>
        HttpResponse.json(
          {
            error: {
              code: "unavailable",
              message: "Selected dates are no longer available.",
            },
          },
          { status: 409 },
        ),
      ),
    );
    renderCheckout();

    await completeRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Complete booking" }));

    expect(await screen.findByText("Couldn't complete booking")).toBeVisible();
    expect(screen.getByText("Selected dates are no longer available.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Complete booking" })).toBeEnabled();
  });
});

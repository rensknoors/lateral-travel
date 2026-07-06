import { describe, expect, it } from "vitest";

import {
  calculateAvailabilityQuote,
  calculateNightCount,
  filterStays,
  sortStays,
} from "@/features/stays/domain/stay-service";
import type { Stay } from "@/features/stays/types/stay";

const createStay = (overrides: Partial<Stay> & { id: string }): Stay => ({
  name: "Nordhaven Loft",
  category: "apartment",
  location: "Copenhagen",
  country: "Denmark",
  tagline: "Calm canal-side base for deep work.",
  imageUrls: ["/img/loft-1.jpg"],
  pricePerNight: { amount: 150, currency: "EUR" },
  rating: 4.8,
  reviewCount: 120,
  maxGuests: 2,
  amenities: ["wifi", "desk"],
  workSetup: {
    deskType: "dedicated-desk",
    wifiMbps: 400,
    quietScore: 90,
    hasMonitor: true,
  },
  isFavorited: false,
  isSuperhost: false,
  isNew: false,
  description: "A quiet loft near the canal with a dedicated workspace.",
  bedrooms: 1,
  bathrooms: 1,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  policies: ["Mock payment only"],
  ...overrides,
});

describe("calculateNightCount", () => {
  it("counts the nights between check-in and check-out", () => {
    expect(calculateNightCount("2026-08-10", "2026-08-14")).toBe(4);
  });

  it("returns 0 for a same-day range", () => {
    expect(calculateNightCount("2026-08-10", "2026-08-10")).toBe(0);
  });

  it("returns 0 when check-out is before check-in", () => {
    expect(calculateNightCount("2026-08-14", "2026-08-10")).toBe(0);
  });
});

describe("calculateAvailabilityQuote", () => {
  const stay = createStay({ id: "quote-stay" });

  it("prices an available stay with the service fee included", () => {
    const quote = calculateAvailabilityQuote({
      stay,
      checkIn: "2026-08-10",
      checkOut: "2026-08-14",
      guests: 2,
    });

    expect(quote).toMatchObject({
      stayId: "quote-stay",
      isAvailable: true,
      nights: 4,
      nightlyRate: { amount: 150, currency: "EUR" },
      subtotal: { amount: 600, currency: "EUR" },
      serviceFee: { amount: 72, currency: "EUR" },
      total: { amount: 672, currency: "EUR" },
    });
    expect(quote.unavailableReason).toBeUndefined();
  });

  it("rounds money amounts to cents", () => {
    const quote = calculateAvailabilityQuote({
      stay: createStay({
        id: "fractional-stay",
        pricePerNight: { amount: 133.33, currency: "EUR" },
      }),
      checkIn: "2026-08-10",
      checkOut: "2026-08-13",
      guests: 2,
    });

    expect(quote.subtotal.amount).toBe(399.99);
    expect(quote.serviceFee.amount).toBe(48);
    expect(quote.total.amount).toBe(447.99);
  });

  it("rejects an inverted date range without charging fees", () => {
    const quote = calculateAvailabilityQuote({
      stay,
      checkIn: "2026-08-14",
      checkOut: "2026-08-10",
      guests: 2,
    });

    expect(quote.isAvailable).toBe(false);
    expect(quote.nights).toBe(0);
    expect(quote.subtotal.amount).toBe(0);
    expect(quote.serviceFee.amount).toBe(0);
    expect(quote.total.amount).toBe(0);
    expect(quote.unavailableReason).toBeTruthy();
  });

  it("rejects guest counts above the stay capacity", () => {
    const quote = calculateAvailabilityQuote({
      stay,
      checkIn: "2026-08-10",
      checkOut: "2026-08-14",
      guests: stay.maxGuests + 1,
    });

    expect(quote.isAvailable).toBe(false);
    expect(quote.serviceFee.amount).toBe(0);
    expect(quote.unavailableReason).toBeTruthy();
  });
});

describe("filterStays", () => {
  const harborLoft = createStay({
    id: "harbor-loft",
    name: "Harbor Loft",
    location: "Lisbon",
    country: "Portugal",
    tagline: "Bright loft with fiber wifi.",
    category: "apartment",
    pricePerNight: { amount: 120, currency: "EUR" },
    maxGuests: 2,
    amenities: ["wifi", "desk"],
  });
  const forestCabin = createStay({
    id: "forest-cabin",
    name: "Forest Cabin",
    location: "Bergen",
    country: "Norway",
    tagline: "Slow mornings under the pines.",
    category: "cabin",
    pricePerNight: { amount: 180, currency: "EUR" },
    maxGuests: 4,
    amenities: ["wifi", "kitchen", "parking"],
  });
  const cityHotel = createStay({
    id: "city-hotel",
    name: "City Hotel",
    location: "Lisbon",
    country: "Portugal",
    tagline: "Boutique rooms above the plaza.",
    category: "boutique-hotel",
    pricePerNight: { amount: 240, currency: "EUR" },
    maxGuests: 3,
    amenities: ["breakfast", "coffee"],
  });
  const stays = [harborLoft, forestCabin, cityHotel];

  const filteredIds = (filters: Parameters<typeof filterStays>[1]) =>
    filterStays(stays, filters).map((stay) => stay.id);

  it("returns every stay without filters", () => {
    expect(filterStays(stays)).toHaveLength(3);
  });

  it("matches a query against the name case-insensitively", () => {
    expect(filteredIds({ query: "HARBOR" })).toEqual(["harbor-loft"]);
  });

  it("matches a query against the tagline", () => {
    expect(filteredIds({ query: "pines" })).toEqual(["forest-cabin"]);
  });

  it("filters by location", () => {
    expect(filteredIds({ location: "lisbon" })).toEqual(["harbor-loft", "city-hotel"]);
  });

  it("filters by category", () => {
    expect(filteredIds({ category: "cabin" })).toEqual(["forest-cabin"]);
  });

  it("keeps only stays with enough guest capacity", () => {
    expect(filteredIds({ guests: 4 })).toEqual(["forest-cabin"]);
  });

  it("filters by price range", () => {
    expect(filteredIds({ minPrice: 150, maxPrice: 200 })).toEqual(["forest-cabin"]);
  });

  it("requires every selected amenity", () => {
    expect(filteredIds({ amenities: ["wifi", "parking"] })).toEqual(["forest-cabin"]);
  });

  it("combines filters", () => {
    expect(filteredIds({ location: "lisbon", maxPrice: 150 })).toEqual(["harbor-loft"]);
  });
});

describe("sortStays", () => {
  const cheapLowRated = createStay({
    id: "cheap-low-rated",
    pricePerNight: { amount: 120, currency: "EUR" },
    rating: 4.6,
  });
  const midTopRated = createStay({
    id: "mid-top-rated",
    pricePerNight: { amount: 180, currency: "EUR" },
    rating: 4.9,
  });
  const expensiveMidRated = createStay({
    id: "expensive-mid-rated",
    pricePerNight: { amount: 240, currency: "EUR" },
    rating: 4.8,
  });
  const stays = [midTopRated, expensiveMidRated, cheapLowRated];

  const sortedIds = (sort?: Parameters<typeof sortStays>[1]) =>
    sortStays(stays, sort).map((stay) => stay.id);

  it("sorts by ascending price", () => {
    expect(sortedIds("price-asc")).toEqual([
      "cheap-low-rated",
      "mid-top-rated",
      "expensive-mid-rated",
    ]);
  });

  it("sorts by descending price", () => {
    expect(sortedIds("price-desc")).toEqual([
      "expensive-mid-rated",
      "mid-top-rated",
      "cheap-low-rated",
    ]);
  });

  it("sorts by rating", () => {
    expect(sortedIds("rating")).toEqual([
      "mid-top-rated",
      "expensive-mid-rated",
      "cheap-low-rated",
    ]);
  });

  it("breaks recommended ties by review count, then quiet score", () => {
    const fewReviews = createStay({ id: "few-reviews", rating: 4.9, reviewCount: 80 });
    const manyReviews = createStay({ id: "many-reviews", rating: 4.9, reviewCount: 200 });
    const manyReviewsQuieter = createStay({
      id: "many-reviews-quieter",
      rating: 4.9,
      reviewCount: 200,
      workSetup: {
        deskType: "dedicated-desk",
        wifiMbps: 400,
        quietScore: 99,
        hasMonitor: true,
      },
    });

    const recommended = sortStays([fewReviews, manyReviews, manyReviewsQuieter]);

    expect(recommended.map((stay) => stay.id)).toEqual([
      "many-reviews-quieter",
      "many-reviews",
      "few-reviews",
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [...stays];
    sortStays(input, "price-asc");

    expect(input.map((stay) => stay.id)).toEqual(stays.map((stay) => stay.id));
  });
});

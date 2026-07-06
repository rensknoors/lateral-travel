import { describe, expect, it } from "vitest";

import { hasActiveStayFilters, parseStayListFilters } from "@/features/stays/utils/stay-filters";

describe("parseStayListFilters", () => {
  it("parses valid params into typed filters", () => {
    const searchParams = new URLSearchParams({
      query: "Lisbon",
      location: "Lisbon",
      guests: "3",
      minPrice: "100",
      maxPrice: "300",
      amenities: "wifi,desk",
      sort: "price-asc",
    });

    expect(parseStayListFilters(searchParams)).toEqual({
      query: "Lisbon",
      location: "Lisbon",
      category: undefined,
      guests: 3,
      minPrice: 100,
      maxPrice: 300,
      amenities: ["wifi", "desk"],
      sort: "price-asc",
    });
  });

  it("drops invalid or unknown values", () => {
    const searchParams = new URLSearchParams({
      guests: "not-a-number",
      amenities: "wifi,laser-tag",
      sort: "oldest",
    });

    expect(parseStayListFilters(searchParams)).toEqual({
      query: undefined,
      location: undefined,
      category: undefined,
      guests: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      amenities: ["wifi"],
      sort: undefined,
    });
  });

  it("returns an empty filter set for an empty query string", () => {
    expect(parseStayListFilters(new URLSearchParams())).toEqual({
      query: undefined,
      location: undefined,
      category: undefined,
      guests: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      amenities: undefined,
      sort: undefined,
    });
  });
});

describe("hasActiveStayFilters", () => {
  it("is false for empty or default-only filters", () => {
    expect(hasActiveStayFilters({})).toBe(false);
    expect(hasActiveStayFilters({ sort: "recommended" })).toBe(false);
  });

  it("is true when any meaningful filter is set", () => {
    expect(hasActiveStayFilters({ query: "Lisbon" })).toBe(true);
    expect(hasActiveStayFilters({ category: "cabin" })).toBe(true);
    expect(hasActiveStayFilters({ amenities: ["wifi"] })).toBe(true);
    expect(hasActiveStayFilters({ sort: "rating" })).toBe(true);
  });
});

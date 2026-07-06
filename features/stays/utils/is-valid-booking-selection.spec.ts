import { describe, expect, it } from "vitest";

import { isValidBookingSelection } from "@/features/stays/utils/is-valid-booking-selection";

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

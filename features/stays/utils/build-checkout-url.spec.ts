import { describe, expect, it } from "vitest";

import { buildCheckoutUrl } from "@/features/stays/utils/build-checkout-url";

describe("buildCheckoutUrl", () => {
  it("builds the checkout query string", () => {
    expect(buildCheckoutUrl("harbor-loft", "2026-07-10", "2026-07-12", 2)).toBe(
      "/checkout?stayId=harbor-loft&checkIn=2026-07-10&checkOut=2026-07-12&guests=2",
    );
  });
});

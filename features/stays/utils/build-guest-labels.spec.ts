import { describe, expect, it } from "vitest";

import { buildGuestLabels } from "@/features/stays/utils/build-guest-labels";

describe("buildGuestLabels", () => {
  it("returns empty labels for zero guests", () => {
    expect(buildGuestLabels(0)).toEqual({});
  });

  it("builds singular and plural labels capped at maxGuests", () => {
    expect(buildGuestLabels(1)).toEqual({ "1": "1 guest" });
    expect(buildGuestLabels(3)).toEqual({
      "1": "1 guest",
      "2": "2 guests",
      "3": "3 guests",
    });
  });
});

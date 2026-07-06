import { describe, expect, it } from "vitest";

import { checkoutFormSchema } from "@/features/bookings/utils/checkout-schema";

const validCheckout = {
  fullName: "Maria Remote",
  email: "maria@example.com",
  termsAccepted: true,
};

describe("checkoutFormSchema", () => {
  it("accepts a valid checkout payload", () => {
    const result = checkoutFormSchema.safeParse(validCheckout);

    expect(result.success).toBe(true);
  });

  it("rejects a missing full name", () => {
    const result = checkoutFormSchema.safeParse({ ...validCheckout, fullName: "" });

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only full name", () => {
    const result = checkoutFormSchema.safeParse({ ...validCheckout, fullName: "   " });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = checkoutFormSchema.safeParse({
      ...validCheckout,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("rejects checkout without accepted terms", () => {
    const result = checkoutFormSchema.safeParse({
      ...validCheckout,
      termsAccepted: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a payload with missing fields", () => {
    const result = checkoutFormSchema.safeParse({ email: "maria@example.com" });

    expect(result.success).toBe(false);
  });
});

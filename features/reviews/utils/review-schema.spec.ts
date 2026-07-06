import { describe, expect, it } from "vitest";

import { reviewFormSchema } from "@/features/reviews/utils/review-schema";

const validReview = {
  authorName: "Maria",
  rating: 5,
  comment: "Loved the fast wifi and quiet workspace for a full week of remote work.",
};

describe("reviewFormSchema", () => {
  it("accepts a valid review", () => {
    const result = reviewFormSchema.safeParse(validReview);

    expect(result.success).toBe(true);
  });

  it("requires a name with at least 2 characters", () => {
    const result = reviewFormSchema.safeParse({ ...validReview, authorName: "M" });

    expect(result.success).toBe(false);
  });

  it("rejects a missing name", () => {
    const result = reviewFormSchema.safeParse({ ...validReview, authorName: "" });

    expect(result.success).toBe(false);
  });

  it("rejects ratings outside 1-5", () => {
    expect(reviewFormSchema.safeParse({ ...validReview, rating: 0 }).success).toBe(false);
    expect(reviewFormSchema.safeParse({ ...validReview, rating: 6 }).success).toBe(false);
  });

  it("rejects a non-integer rating", () => {
    const result = reviewFormSchema.safeParse({ ...validReview, rating: 3.5 });

    expect(result.success).toBe(false);
  });

  it("rejects a comment below the minimum length", () => {
    const result = reviewFormSchema.safeParse({ ...validReview, comment: "Too short." });

    expect(result.success).toBe(false);
  });

  it("rejects a comment above the maximum length", () => {
    const result = reviewFormSchema.safeParse({
      ...validReview,
      comment: "a".repeat(1001),
    });

    expect(result.success).toBe(false);
  });

  it("rejects comments with blocked spam or profane terms", () => {
    expect(
      reviewFormSchema.safeParse({
        ...validReview,
        comment: "Great stay but please click here for a free money crypto giveaway!!!",
      }).success,
    ).toBe(false);

    expect(
      reviewFormSchema.safeParse({
        ...validReview,
        comment: "This place is shit and I would not recommend staying here at all.",
      }).success,
    ).toBe(false);
  });
});

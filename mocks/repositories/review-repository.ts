import type { CreateReviewRequest } from "@/features/reviews/types/review";
import { createReviewFromRequest } from "@/mocks/factories";
import { reviewsByStayId } from "@/mocks/reviews";

export const listReviews = (stayId: string) => reviewsByStayId.get(stayId) ?? [];

export const addReview = (stayId: string, request: CreateReviewRequest) => {
  const review = createReviewFromRequest(stayId, request);
  const existingReviews = listReviews(stayId);

  reviewsByStayId.set(stayId, [review, ...existingReviews]);

  return review;
};

import type { Review } from "@/features/reviews/types/review";
import { createReview } from "@/mocks/factories";
import { mockStays } from "@/mocks/stays";

export const reviewsByStayId = new Map<string, Review[]>(
  mockStays.map((stay): [string, Review[]] => [stay.id, [createReview(stay.id)]]),
);

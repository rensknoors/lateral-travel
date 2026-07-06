export const RATING_VALUES = [1, 2, 3, 4, 5] as const;
export type ReviewRating = (typeof RATING_VALUES)[number];

export type Review = {
  id: string;
  stayId: string;
  authorName: string;
  rating: ReviewRating;
  comment: string;
  createdAt: string;
};

export type CreateReviewRequest = Pick<Review, "authorName" | "rating" | "comment">;

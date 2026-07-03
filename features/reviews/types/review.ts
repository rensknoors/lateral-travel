export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type Review = {
  id: string;
  stayId: string;
  authorName: string;
  rating: ReviewRating;
  comment: string;
  createdAt: string;
};

export type CreateReviewRequest = Pick<Review, "authorName" | "rating" | "comment">;

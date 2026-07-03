import { apiFetch } from "@/lib/api/client";
import type { CreateReviewRequest, Review } from "@/features/reviews/types/review";

export const getReviews = (stayId: string) =>
  apiFetch<Review[]>(`/api/stays/${stayId}/reviews`);

export const addReview = (stayId: string, request: CreateReviewRequest) =>
  apiFetch<Review>(`/api/stays/${stayId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

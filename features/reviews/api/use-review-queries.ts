"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addReview, getReviews } from "@/features/reviews/api/review-api";
import type { CreateReviewRequest } from "@/features/reviews/types/review";
import { stayQueryKeys } from "@/features/stays/api/use-stay-queries";

export const reviewQueryKeys = {
  all: ["reviews"] as const,
  list: (stayId: string) => [...reviewQueryKeys.all, stayId] as const,
};

export const useReviewsQuery = (stayId: string) =>
  useQuery({
    queryKey: reviewQueryKeys.list(stayId),
    queryFn: () => getReviews(stayId),
    enabled: Boolean(stayId),
  });

export const useAddReviewMutation = (stayId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateReviewRequest) => addReview(stayId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.list(stayId) });
      queryClient.invalidateQueries({ queryKey: stayQueryKeys.detail(stayId) });
    },
  });
};

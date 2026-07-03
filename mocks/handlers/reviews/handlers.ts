import { http, HttpResponse } from "msw";

import type { CreateReviewRequest, Review } from "@/features/reviews/types/review";
import { notFound } from "@/mocks/handlers/helpers";
import { getStayById } from "@/mocks/repositories/stay-repository";
import { addReview, listReviews } from "@/mocks/repositories/review-repository";

export const reviewHandlers = [
  http.get("*/api/stays/:stayId/reviews", ({ params }) => {
    const stayId = String(params.stayId);

    if (!getStayById(stayId)) {
      return notFound("Stay not found.");
    }

    return HttpResponse.json<Review[]>(listReviews(stayId));
  }),

  http.post("*/api/stays/:stayId/reviews", async ({ params, request }) => {
    const stayId = String(params.stayId);

    if (!getStayById(stayId)) {
      return notFound("Stay not found.");
    }

    const body = (await request.json()) as CreateReviewRequest;
    const review = addReview(stayId, body);

    return HttpResponse.json<Review>(review, { status: 201 });
  }),
];

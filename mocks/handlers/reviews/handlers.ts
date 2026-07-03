import { http, HttpResponse } from "msw";

import type { CreateReviewRequest, Review } from "@/features/reviews/types/review";
import { createReviewFromRequest } from "@/mocks/factories";
import { reviewsByStayId } from "@/mocks/reviews";
import { getStay, notFound } from "@/mocks/handlers/helpers";

export const reviewHandlers = [
  http.get("*/api/stays/:stayId/reviews", ({ params }) => {
    const stayId = String(params.stayId);

    if (!getStay(stayId)) {
      return notFound("Stay not found.");
    }

    return HttpResponse.json<Review[]>(reviewsByStayId.get(stayId) ?? []);
  }),

  http.post("*/api/stays/:stayId/reviews", async ({ params, request }) => {
    const stayId = String(params.stayId);

    if (!getStay(stayId)) {
      return notFound("Stay not found.");
    }

    const body = (await request.json()) as CreateReviewRequest;
    const review = createReviewFromRequest(stayId, body);

    const existing = reviewsByStayId.get(stayId) ?? [];
    reviewsByStayId.set(stayId, [review, ...existing]);

    return HttpResponse.json<Review>(review, { status: 201 });
  }),
];

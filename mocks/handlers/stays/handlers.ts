import { http, HttpResponse } from "msw";

import type { Stay, StayListResponse } from "@/features/stays/types/stay";
import {
  createAvailabilityQuote,
  getStay,
  notFound,
  toStaySummary,
} from "@/mocks/handlers/helpers";
import { mockStays } from "@/mocks/stays";

export const stayHandlers = [
  http.get("*/api/stays", () => {
    const stays = mockStays.map(toStaySummary);

    return HttpResponse.json<StayListResponse>({
      stays,
      total: stays.length,
      filters: {},
    });
  }),

  http.get("*/api/stays/:stayId", ({ params }) => {
    const stay = getStay(String(params.stayId));

    if (!stay) {
      return notFound("Stay not found.");
    }

    return HttpResponse.json<Stay>(stay);
  }),

  http.get("*/api/stays/:stayId/availability", ({ params, request }) => {
    const stay = getStay(String(params.stayId));

    if (!stay) {
      return notFound("Stay not found.");
    }

    const url = new URL(request.url);
    const checkIn = url.searchParams.get("checkIn") ?? "";
    const checkOut = url.searchParams.get("checkOut") ?? "";
    const guests = Number(url.searchParams.get("guests") ?? "1");

    return HttpResponse.json(
      createAvailabilityQuote(stay, checkIn, checkOut, guests),
    );
  }),
];

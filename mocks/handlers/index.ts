import { bookingHandlers } from "@/mocks/handlers/bookings/handlers";
import { reviewHandlers } from "@/mocks/handlers/reviews/handlers";
import { stayHandlers } from "@/mocks/handlers/stays/handlers";

export const handlers = [...stayHandlers, ...reviewHandlers, ...bookingHandlers];

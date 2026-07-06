import { faker } from "@faker-js/faker";

import { createBookingReference } from "@/features/bookings/domain/booking-service";
import type { Booking, CreateBookingRequest } from "@/features/bookings/types/booking";
import type { CreateReviewRequest, Review } from "@/features/reviews/types/review";
import type { AvailabilityQuote, Stay } from "@/features/stays/types/stay";
import {
  DESK_TYPES,
  STAY_AMENITIES,
  STAY_CATEGORIES,
} from "@/features/stays/types/stay";

export const MOCK_NOW = "2026-07-02T12:00:00.000Z";

const REVIEW_RATINGS = [4, 5] as const satisfies Review["rating"][];

const createStayImages = (seed: string) => [
  `https://picsum.photos/seed/${seed}/1200/800`,
  `https://picsum.photos/seed/${seed}-2/1200/800`,
  `https://picsum.photos/seed/${seed}-3/1200/800`,
  `https://picsum.photos/seed/${seed}-4/1200/800`,
];

export const createStay = (overrides: Partial<Stay> & { id: string }): Stay => {
  const imageUrls = createStayImages(overrides.id);

  return {
    name: faker.company.name(),
    category: faker.helpers.arrayElement([...STAY_CATEGORIES]),
    location: faker.location.city(),
    country: faker.location.country(),
    tagline: faker.company.catchPhrase(),
    imageUrls,
    pricePerNight: {
      amount: faker.number.int({ min: 145, max: 245 }),
      currency: "EUR",
    },
    rating: faker.number.float({ min: 4.6, max: 4.95, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 75, max: 240 }),
    maxGuests: faker.number.int({ min: 2, max: 4 }),
    amenities: faker.helpers.arrayElements(STAY_AMENITIES, { min: 4, max: 6 }),
    workSetup: {
      deskType: faker.helpers.arrayElement([...DESK_TYPES]),
      wifiMbps: faker.number.int({ min: 200, max: 600 }),
      quietScore: faker.number.int({ min: 85, max: 99 }),
      hasMonitor: faker.datatype.boolean(),
    },
    isFavorited: false,
    isSuperhost: faker.datatype.boolean({ probability: 0.4 }),
    isNew: faker.datatype.boolean({ probability: 0.25 }),
    description: faker.lorem.sentences({ min: 2, max: 3 }),
    bedrooms: faker.number.int({ min: 1, max: 2 }),
    bathrooms: faker.number.int({ min: 1, max: 2 }),
    checkInTime: faker.helpers.arrayElement(["14:00", "15:00", "16:00"]),
    checkOutTime: faker.helpers.arrayElement(["10:00", "11:00", "12:00"]),
    policies: ["Mock payment only", faker.lorem.sentence()],
    ...overrides,
  };
};

export const createReview = (stayId: string, overrides?: Partial<Review>): Review => ({
  id: faker.string.uuid(),
  stayId,
  authorName: faker.person.firstName(),
  rating: faker.helpers.arrayElement(REVIEW_RATINGS),
  comment: faker.lorem.sentence({ min: 8, max: 14 }),
  createdAt: faker.date.recent({ days: 90, refDate: MOCK_NOW }).toISOString(),
  ...overrides,
});

export const createReviewFromRequest = (
  stayId: string,
  request: CreateReviewRequest,
): Review =>
  createReview(stayId, {
    authorName: request.authorName,
    rating: request.rating,
    comment: request.comment,
    createdAt: MOCK_NOW,
  });

export const createBooking = (
  request: CreateBookingRequest,
  quote: AvailabilityQuote,
): Booking => {
  const id = faker.string.uuid();

  return {
    id,
    reference: createBookingReference(id),
    status: "confirmed",
    createdAt: MOCK_NOW,
    stayId: request.stayId,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    guests: request.guests,
    guest: request.guest,
    paymentMethod: request.paymentMethod,
    quote,
    total: quote.total,
  };
};

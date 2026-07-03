import { HttpResponse } from "msw";

import type { AvailabilityQuote, Money, Stay, StaySummary } from "@/features/stays/types/stay";
import { findStay } from "@/mocks/stays";

export const notFound = (message: string) =>
  HttpResponse.json(
    { error: { code: "not-found", message } },
    { status: 404 },
  );

export const getStay = (stayId: string) => findStay(stayId);

export const toStaySummary = (stay: Stay): StaySummary => {
  const {
    description: _description,
    imageUrls: _imageUrls,
    bedrooms: _bedrooms,
    bathrooms: _bathrooms,
    checkInTime: _checkInTime,
    checkOutTime: _checkOutTime,
    policies: _policies,
    ...summary
  } = stay;

  return summary;
};

const money = (amount: number): Money => ({
  amount: Math.round(amount * 100) / 100,
  currency: "EUR",
});

const getNightCount = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
  const dayMs = 86_400_000;

  return Math.max(
    0,
    Math.round((checkOutDate.getTime() - checkInDate.getTime()) / dayMs),
  );
};

export const createAvailabilityQuote = (
  stay: Stay,
  checkIn: string,
  checkOut: string,
  guests: number,
): AvailabilityQuote => {
  const nights = getNightCount(checkIn, checkOut);
  const isAvailable = nights > 0 && guests <= stay.maxGuests;
  const subtotal = stay.pricePerNight.amount * nights;
  const serviceFee = isAvailable ? subtotal * 0.12 : 0;

  return {
    stayId: stay.id,
    checkIn,
    checkOut,
    guests,
    isAvailable,
    nights,
    nightlyRate: stay.pricePerNight,
    subtotal: money(subtotal),
    serviceFee: money(serviceFee),
    total: money(subtotal + serviceFee),
    unavailableReason: isAvailable ? undefined : "Selected dates or guest count are unavailable.",
  };
};

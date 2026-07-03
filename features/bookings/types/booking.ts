import type { AvailabilityQuote, DateRange, Money } from "@/features/stays/types/stay";

export type BookingStatus = "confirmed" | "cancelled";
export type PaymentMethod = "mock-card";

export type BookingGuest = {
  fullName: string;
  email: string;
};

export type CreateBookingRequest = DateRange & {
  stayId: string;
  guests: number;
  guest: BookingGuest;
  paymentMethod: PaymentMethod;
};

export type Booking = CreateBookingRequest & {
  id: string;
  reference: string;
  status: BookingStatus;
  createdAt: string;
  quote: AvailabilityQuote;
  total: Money;
};

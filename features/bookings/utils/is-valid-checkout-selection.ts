import { isValidBookingSelection } from "@/features/stays/utils/is-valid-booking-selection";

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateParam = (value: string) => {
  if (!DATE_PARAM_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

export const isValidCheckoutSelection = (
  stayId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
) =>
  Boolean(stayId.trim()) &&
  Number.isInteger(guests) &&
  isValidDateParam(checkIn) &&
  isValidDateParam(checkOut) &&
  isValidBookingSelection(checkIn, checkOut, guests);

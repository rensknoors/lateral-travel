const bookingDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const toUtcDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

export const formatBookingDateRange = (checkIn: string, checkOut: string) =>
  `${bookingDateFormatter.format(toUtcDate(checkIn))} - ${bookingDateFormatter.format(
    toUtcDate(checkOut),
  )}`;

export const formatGuestCount = (guests: number) =>
  `${guests} guest${guests === 1 ? "" : "s"}`;

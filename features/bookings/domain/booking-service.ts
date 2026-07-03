const REFERENCE_PREFIX = "LT";
const REFERENCE_BODY_LENGTH = 6;

export const createBookingReference = (bookingId: string) => {
  const normalizedId = bookingId.replaceAll(/[^a-z\d]/gi, "").toUpperCase();
  const referenceBody = normalizedId
    .slice(0, REFERENCE_BODY_LENGTH)
    .padEnd(REFERENCE_BODY_LENGTH, "0");

  return `${REFERENCE_PREFIX}-${referenceBody}`;
};

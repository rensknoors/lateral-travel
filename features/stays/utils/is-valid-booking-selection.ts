export const isValidBookingSelection = (
  checkIn: string,
  checkOut: string,
  guests: number,
) => {
  if (!checkIn || !checkOut || guests <= 0) return false;
  return checkOut > checkIn;
};

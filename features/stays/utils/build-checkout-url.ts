export const buildCheckoutUrl = (
  stayId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
) => {
  const params = new URLSearchParams({
    stayId,
    checkIn,
    checkOut,
    guests: String(guests),
  });

  return `/checkout?${params.toString()}`;
};

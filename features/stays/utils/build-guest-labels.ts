export const buildGuestLabels = (maxGuests: number) =>
  Object.fromEntries(
    Array.from({ length: maxGuests }, (_, index) => {
      const count = index + 1;
      return [String(count), `${count} guest${count > 1 ? "s" : ""}`];
    }),
  );

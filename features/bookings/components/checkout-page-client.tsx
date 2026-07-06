"use client";

import { useRouter } from "next/navigation";

import { CheckoutFlow } from "@/features/bookings/components/checkout-flow";

interface CheckoutPageClientProps {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const CheckoutPageClient = ({
  stayId,
  checkIn,
  checkOut,
  guests,
}: CheckoutPageClientProps) => {
  const router = useRouter();

  return (
    <CheckoutFlow
      stayId={stayId}
      checkIn={checkIn}
      checkOut={checkOut}
      guests={guests}
      onBookingCreated={(bookingId) => router.push(`/bookings/${bookingId}`)}
    />
  );
};

export { CheckoutPageClient };

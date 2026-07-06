import { CheckoutPageClient } from "@/features/bookings/components/checkout-page-client";

type CheckoutSearchParams = Record<string, string | string[] | undefined>;

interface CheckoutPageProps {
  searchParams: Promise<CheckoutSearchParams>;
}

const getStringParam = (params: CheckoutSearchParams, name: string) => {
  const value = params[name];

  return typeof value === "string" ? value : "";
};

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
  const params = await searchParams;
  const stayId = getStringParam(params, "stayId");
  const checkIn = getStringParam(params, "checkIn");
  const checkOut = getStringParam(params, "checkOut");
  const guests = Number(getStringParam(params, "guests"));

  return (
    <CheckoutPageClient
      stayId={stayId}
      checkIn={checkIn}
      checkOut={checkOut}
      guests={guests}
    />
  );
};

export default CheckoutPage;

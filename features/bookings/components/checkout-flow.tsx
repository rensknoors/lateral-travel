"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { ContentContainer } from "@/components/layout/content-container";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCreateBookingMutation } from "@/features/bookings/api/use-booking-queries";
import type { AvailabilityQuote } from "@/features/stays/types/stay";
import {
  formatBookingDateRange,
  formatGuestCount,
} from "@/features/bookings/utils/booking-display";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/features/bookings/utils/checkout-schema";
import { isValidCheckoutSelection } from "@/features/bookings/utils/is-valid-checkout-selection";
import { useAvailabilityQuery, useStayQuery } from "@/features/stays/api/use-stay-queries";
import { ApiError } from "@/lib/api-client/api-client";
import { formatMoney } from "@/lib/format";

interface CheckoutFlowProps {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  onBookingCreated?: (bookingId: string) => void;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const FieldError = ({ id, message }: { id: string; message?: string }) => {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
};

const CheckoutRecovery = () => (
  <ContentContainer size="md" className="py-14">
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>Choose valid dates</AlertTitle>
      <AlertDescription>
        Checkout needs a stay, check-in, check-out and at least one guest.
      </AlertDescription>
      <AlertAction>
        <Link href="/" className={buttonVariants({ size: "sm", variant: "outline" })}>
          Return to stays
        </Link>
      </AlertAction>
    </Alert>
  </ContentContainer>
);

const CheckoutLoading = () => (
  <ContentContainer size="lg" className="py-14">
    <Card>
      <CardHeader>
        <CardTitle>Preparing checkout…</CardTitle>
        <CardDescription>Confirming the latest availability and price.</CardDescription>
      </CardHeader>
    </Card>
  </ContentContainer>
);

const CheckoutSummary = ({
  stayName,
  checkIn,
  checkOut,
  guests,
  quote,
}: {
  stayName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  quote: AvailabilityQuote;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Booking summary</CardTitle>
      <CardDescription>{stayName}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <dl className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Dates</dt>
          <dd className="font-medium">
            {formatBookingDateRange(checkIn, checkOut)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Guests</dt>
          <dd className="font-medium">{formatGuestCount(guests)}</dd>
        </div>
      </dl>

      <Separator />

      <dl className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">
            {formatMoney(quote.nightlyRate)} x {quote.nights} night
            {quote.nights === 1 ? "" : "s"}
          </dt>
          <dd>{formatMoney(quote.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Service fee</dt>
          <dd>{formatMoney(quote.serviceFee)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
          <dt>Total</dt>
          <dd>{formatMoney(quote.total)}</dd>
        </div>
      </dl>
    </CardContent>
  </Card>
);

const CheckoutFlow = ({
  stayId,
  checkIn,
  checkOut,
  guests,
  onBookingCreated,
}: CheckoutFlowProps) => {
  const isSelectionValid = isValidCheckoutSelection(stayId, checkIn, checkOut, guests);
  const {
    data: stay,
    isLoading: isStayLoading,
    isError: isStayError,
    error: stayError,
    refetch: refetchStay,
  } = useStayQuery(isSelectionValid ? stayId : "");
  const {
    data: quote,
    isLoading: isQuoteLoading,
    isError: isQuoteError,
    error: quoteError,
    refetch: refetchQuote,
  } = useAvailabilityQuery(stayId, checkIn, checkOut, guests, isSelectionValid);
  const {
    mutate: createBooking,
    isPending: isCreatingBooking,
    isError: hasBookingError,
    error: bookingError,
  } = useCreateBookingMutation();
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      termsAccepted: false,
    },
  });

  if (!isSelectionValid) {
    return <CheckoutRecovery />;
  }

  if (isStayLoading || isQuoteLoading) {
    return <CheckoutLoading />;
  }

  if (isStayError || isQuoteError) {
    const message = getErrorMessage(
      stayError ?? quoteError,
      "We couldn't prepare checkout right now.",
    );

    return (
      <ContentContainer size="md" className="py-14">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Couldn't prepare checkout</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <AlertAction>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void refetchStay();
                void refetchQuote();
              }}
            >
              Try again
            </Button>
          </AlertAction>
        </Alert>
      </ContentContainer>
    );
  }

  if (!stay || !quote || !quote.isAvailable) {
    return (
      <ContentContainer size="md" className="py-14">
        <Alert>
          <CircleAlert />
          <AlertTitle>Stay unavailable</AlertTitle>
          <AlertDescription>
            {quote?.unavailableReason ??
              "Selected dates or guest count are unavailable."}
          </AlertDescription>
          <AlertAction>
            <Link
              href={`/stays/${stayId}`}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Change selection
            </Link>
          </AlertAction>
        </Alert>
      </ContentContainer>
    );
  }

  const submitBooking = (values: CheckoutFormValues) => {
    const result = checkoutFormSchema.safeParse(values);

    if (!result.success) {
      const firstField = result.error.issues[0]?.path[0] as
        | keyof CheckoutFormValues
        | undefined;

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormValues;
        setError(field, { message: issue.message });
      }

      if (firstField) {
        setFocus(firstField);
      }
      return;
    }

    createBooking(
      {
        stayId,
        checkIn,
        checkOut,
        guests,
        guest: {
          fullName: result.data.fullName,
          email: result.data.email,
        },
        paymentMethod: "mock-card",
      },
      {
        onSuccess: (booking) => {
          onBookingCreated?.(booking.id);
        },
      },
    );
  };

  return (
    <ContentContainer size="lg" className="py-10 lg:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Checkout</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
          Confirm your stay
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review the latest quote, add guest details and confirm the mocked payment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          noValidate
          onSubmit={handleSubmit(submitBooking)}
          className="flex flex-col gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Guest details</CardTitle>
              <CardDescription>Used for the booking confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1.5">
                <label htmlFor="checkout-full-name" className="text-sm font-medium">
                  Full name
                </label>
                <Input
                  id="checkout-full-name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName ? "checkout-full-name-error" : undefined
                  }
                  {...register("fullName")}
                />
                <FieldError
                  id="checkout-full-name-error"
                  message={errors.fullName?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="checkout-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "checkout-email-error" : undefined
                  }
                  {...register("email")}
                />
                <FieldError
                  id="checkout-email-error"
                  message={errors.email?.message}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mock payment</CardTitle>
              <CardDescription>
                No real payment is collected in this assessment flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-dashed border-border bg-muted/35 p-4 text-sm text-muted-foreground">
                Mock card payment will be approved automatically when the booking
                is available.
              </div>
              <div className="space-y-1.5">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-border"
                    aria-invalid={Boolean(errors.termsAccepted)}
                    aria-describedby={
                      errors.termsAccepted ? "checkout-terms-error" : undefined
                    }
                    {...register("termsAccepted")}
                  />
                  <span>I agree to the booking terms and mocked payment flow.</span>
                </label>
                <FieldError
                  id="checkout-terms-error"
                  message={errors.termsAccepted?.message}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3">
              {hasBookingError && (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertTitle>Couldn&apos;t complete booking</AlertTitle>
                  <AlertDescription>
                    {getErrorMessage(
                      bookingError,
                      "Please try again in a moment.",
                    )}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={isCreatingBooking}
              >
                {isCreatingBooking ? "Completing…" : "Complete booking"}
              </Button>
            </CardFooter>
          </Card>
        </form>

        <aside>
          <CheckoutSummary
            stayName={stay.name}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            quote={quote}
          />
        </aside>
      </div>
    </ContentContainer>
  );
};

export { CheckoutFlow };

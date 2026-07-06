"use client";

import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";

import { ContentContainer } from "@/components/layout/content-container";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBookingQuery } from "@/features/bookings/api/use-booking-queries";
import {
  formatBookingDateRange,
  formatGuestCount,
} from "@/features/bookings/utils/booking-display";
import { useStayQuery } from "@/features/stays/api/use-stay-queries";
import { ApiError } from "@/lib/api-client/api-client";
import { formatMoney } from "@/lib/format";

interface BookingConfirmationProps {
  bookingId: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const BookingConfirmationLoading = () => (
  <ContentContainer size="md" className="py-14">
    <Card>
      <CardHeader>
        <CardTitle>Loading confirmation…</CardTitle>
        <CardDescription>Fetching the booking details.</CardDescription>
      </CardHeader>
    </Card>
  </ContentContainer>
);

const BookingConfirmationError = ({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) => (
  <ContentContainer size="md" className="py-14">
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </AlertAction>
    </Alert>
  </ContentContainer>
);

const BookingConfirmation = ({ bookingId }: BookingConfirmationProps) => {
  const {
    data: booking,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: bookingError,
    refetch: refetchBooking,
  } = useBookingQuery(bookingId);
  const {
    data: stay,
    isLoading: isStayLoading,
    isError: isStayError,
    error: stayError,
    refetch: refetchStay,
  } = useStayQuery(booking?.stayId ?? "");

  if (isBookingLoading || (booking && isStayLoading)) {
    return <BookingConfirmationLoading />;
  }

  if (isBookingError) {
    return (
      <BookingConfirmationError
        title="Couldn't load booking"
        message={getErrorMessage(bookingError, "Please try again in a moment.")}
        onRetry={() => {
          void refetchBooking();
        }}
      />
    );
  }

  if (isStayError) {
    return (
      <BookingConfirmationError
        title="Couldn't load stay"
        message={getErrorMessage(stayError, "Please try again in a moment.")}
        onRetry={() => {
          void refetchStay();
        }}
      />
    );
  }

  if (!booking || !stay) {
    return (
      <ContentContainer size="md" className="py-14">
        <Alert>
          <CircleAlert />
          <AlertTitle>Booking not found</AlertTitle>
          <AlertDescription>
            We couldn't find this confirmation. Start a new search to book a stay.
          </AlertDescription>
          <AlertAction>
            <Link
              href="/"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Return to stays
            </Link>
          </AlertAction>
        </Alert>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer size="md" className="py-10 lg:py-14">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Booking confirmed
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Your stay is reserved
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{stay.name}</CardTitle>
              <CardDescription>
                {stay.location}, {stay.country}
              </CardDescription>
            </div>
            <Badge variant="success" dot>
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="mt-1 font-semibold text-foreground">
                {booking.reference}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dates</dt>
              <dd className="mt-1 font-semibold text-foreground">
                {formatBookingDateRange(booking.checkIn, booking.checkOut)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Guests</dt>
              <dd className="mt-1 font-semibold text-foreground">
                {formatGuestCount(booking.guests)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="mt-1 font-semibold text-foreground">
                {formatMoney(booking.total)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </ContentContainer>
  );
};

export { BookingConfirmation };

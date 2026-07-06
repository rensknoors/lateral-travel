"use client";

import { CircleAlert } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { AvailabilityQuote } from "@/features/stays/types/stay";
import { StayAvailabilityPanelSkeleton } from "@/features/stays/components/stay-availability-panel.skeleton";
import { formatMoney } from "@/lib/format";

interface AvailabilityQuoteProps {
  quote: AvailabilityQuote | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const AvailabilityQuote = ({
  quote,
  isLoading,
  isError,
  onRetry,
}: AvailabilityQuoteProps) => {
  if (isLoading) return <StayAvailabilityPanelSkeleton />;

  if (isError) {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Couldn&apos;t check availability</AlertTitle>
        <AlertDescription>Please try again.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </AlertAction>
      </Alert>
    );
  }

  if (!quote) return null;

  if (!quote.isAvailable) {
    return (
      <Alert>
        <CircleAlert />
        <AlertTitle>Not available</AlertTitle>
        <AlertDescription>
          {quote.unavailableReason ??
            "Selected dates or guest count are unavailable."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <dl className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">
          {formatMoney(quote.nightlyRate)} x {quote.nights} night
          {quote.nights > 1 ? "s" : ""}
        </dt>
        <dd>{formatMoney(quote.subtotal)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Service fee</dt>
        <dd>{formatMoney(quote.serviceFee)}</dd>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 font-semibold text-foreground">
        <dt>Total</dt>
        <dd>{formatMoney(quote.total)}</dd>
      </div>
    </dl>
  );
};

export { AvailabilityQuote };

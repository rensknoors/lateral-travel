"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Stay } from "@/features/stays/types/stay";
import { buildCheckoutUrl } from "@/features/stays/utils/build-checkout-url";
import { buildGuestLabels } from "@/features/stays/utils/build-guest-labels";
import { isValidBookingSelection } from "@/features/stays/utils/is-valid-booking-selection";
import { formatMoney } from "@/lib/format";

interface StayAvailabilityPanelProps {
  stay: Stay;
}

const StayAvailabilityPanel = ({ stay }: StayAvailabilityPanelProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const guestCount = Number(guests);
  const guestLabels = buildGuestLabels(stay.maxGuests);
  const canReserve = isValidBookingSelection(checkIn, checkOut, guestCount);
  const checkoutUrl = buildCheckoutUrl(stay.id, checkIn, checkOut, guestCount);

  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-1.5">
          <span className="font-heading text-2xl font-semibold">
            {formatMoney(stay.pricePerNight)}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            / night
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <label htmlFor="check-in" className="text-sm font-medium">
              Check-in
            </label>
            <Input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="check-out" className="text-sm font-medium">
              Check-out
            </label>
            <Input
              id="check-out"
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="guests" className="text-sm font-medium">
              Guests
            </label>
            <Select
              value={guests}
              items={guestLabels}
              onValueChange={(value) => value && setGuests(value)}
            >
              <SelectTrigger id="guests" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(guestLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {canReserve ? (
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            render={<Link href={checkoutUrl} />}
          >
            Reserve
          </Button>
        ) : (
          <Button variant="accent" size="lg" className="w-full" disabled>
            Reserve
          </Button>
        )}
        <p className="text-center text-xs text-muted-foreground">
          You won&apos;t be charged yet
        </p>
      </CardFooter>
    </Card>
  );
};

export { StayAvailabilityPanel };

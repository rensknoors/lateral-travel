"use client";

import { Minus, Plus, Search } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StayListFilters } from "@/features/stays/types/stay";
import { cn } from "@/lib/utils";

type StaySearchValues = Pick<StayListFilters, "query" | "location" | "guests">;

interface StaySearchFormProps {
  initialValues: StaySearchValues;
  onSearch: (values: StaySearchValues) => void;
  variant?: "default" | "hero";
}

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
const ANY_GUESTS = "any";
const MIN_GUESTS = 1;
const MAX_GUESTS = 16;

const GUEST_LABELS: Record<string, string> = {
  [ANY_GUESTS]: "Any guests",
  ...Object.fromEntries(
    GUEST_OPTIONS.map((count) => [
      String(count),
      `${count} guest${count > 1 ? "s" : ""}`,
    ]),
  ),
};

const HeroSearchField = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex min-w-0 flex-1 flex-col gap-0.5 border-border px-4 py-3 transition-colors has-[:focus-visible]:bg-accent/40 sm:px-5 sm:py-3.5",
      className,
    )}
  >
    <span className="text-xs font-semibold text-foreground">{label}</span>
    {children}
  </div>
);

const StaySearchForm = ({
  initialValues,
  onSearch,
  variant = "default",
}: StaySearchFormProps) => {
  const [query, setQuery] = useState(initialValues.query ?? "");
  const [location, setLocation] = useState(initialValues.location ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(
    initialValues.guests ? String(initialValues.guests) : ANY_GUESTS,
  );
  const [heroGuests, setHeroGuests] = useState(initialValues.guests ?? 1);

  useEffect(() => {
    setQuery(initialValues.query ?? "");
    setLocation(initialValues.location ?? "");
    setGuests(initialValues.guests ? String(initialValues.guests) : ANY_GUESTS);
    setHeroGuests(initialValues.guests ?? 1);
  }, [initialValues.query, initialValues.location, initialValues.guests]);

  const submitValues = (): StaySearchValues => ({
    query: query.trim() || undefined,
    location: location.trim() || undefined,
    guests:
      variant === "hero"
        ? heroGuests
        : guests === ANY_GUESTS
          ? undefined
          : Number(guests),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(submitValues());
  };

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col overflow-hidden rounded-full border border-border bg-card shadow-xl sm:flex-row sm:items-stretch"
      >
        <HeroSearchField label="Where" className="sm:flex-[2] sm:border-r">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Destination, city, property"
            aria-label="Destination"
            className="w-full border-0 bg-transparent p-0 text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
        </HeroSearchField>

        <HeroSearchField
          label="Check in"
          className="hidden sm:flex sm:flex-1 sm:border-r"
        >
          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            aria-label="Check in"
            className="w-full border-0 bg-transparent p-0 text-sm text-foreground outline-none"
          />
        </HeroSearchField>

        <HeroSearchField
          label="Check out"
          className="hidden sm:flex sm:flex-1 sm:border-r"
        >
          <input
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            aria-label="Check out"
            className="w-full border-0 bg-transparent p-0 text-sm text-foreground outline-none"
          />
        </HeroSearchField>

        <HeroSearchField label="Guests" className="hidden sm:flex sm:flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease guests"
              disabled={heroGuests <= MIN_GUESTS}
              onClick={() =>
                setHeroGuests((count) => Math.max(MIN_GUESTS, count - 1))
              }
              className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-border bg-transparent text-foreground transition-opacity disabled:opacity-35"
            >
              <Minus className="size-3" />
            </button>
            <span className="min-w-4 text-center text-base font-medium">
              {heroGuests}
            </span>
            <button
              type="button"
              aria-label="Increase guests"
              disabled={heroGuests >= MAX_GUESTS}
              onClick={() =>
                setHeroGuests((count) => Math.min(MAX_GUESTS, count + 1))
              }
              className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-border bg-transparent text-foreground transition-opacity disabled:opacity-35"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </HeroSearchField>

        <div className="flex items-center justify-end p-2 sm:p-2 sm:pl-1">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="rounded-full px-5"
          >
            <Search className="size-4.5" />
            Search
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-card p-3 shadow-xl ring-1 ring-foreground/10 sm:p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1.4fr_1fr_auto]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, city, or vibe"
          aria-label="Search stays"
          className="h-11"
        />
        <Input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          aria-label="Location"
          className="h-11"
        />
        <Select
          value={guests}
          items={GUEST_LABELS}
          onValueChange={(value) => value && setGuests(value)}
        >
          <SelectTrigger aria-label="Guests" className="h-11 w-full">
            <SelectValue placeholder="Guests" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GUEST_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="accent" size="lg">
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </form>
  );
};

export { StaySearchForm };
export type { StaySearchValues };

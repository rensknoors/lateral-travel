"use client";

import { Bath, BedDouble, Heart, MapPin, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import {
  useSetStayFavoriteMutation,
} from "@/features/stays/api/use-stay-queries";
import type { Stay } from "@/features/stays/types/stay";
import { humanizeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StayHeaderProps {
  stay: Stay;
}

const StayHeader = ({ stay }: StayHeaderProps) => {
  const [isFavorited, setIsFavorited] = useState(stay.isFavorited);
  const { mutate: setStayFavorite } = useSetStayFavoriteMutation();

  const handleFavoriteToggle = () => {
    const nextFavorited = !isFavorited;
    setIsFavorited(nextFavorited);
    setStayFavorite({ stayId: stay.id, isFavorited: nextFavorited });
  };

  return (
    <header className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{humanizeLabel(stay.category)}</Badge>
        {stay.isNew && <Badge variant="accent">New</Badge>}
        {stay.isSuperhost && <Badge variant="warm">Superhost</Badge>}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {stay.location}, {stay.country}
          </p>
          <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
            {stay.name}
          </h1>
          <p className="text-base text-muted-foreground">{stay.tagline}</p>
        </div>

        <button
          type="button"
          onClick={handleFavoriteToggle}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? "Remove from saved" : "Save stay"}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Heart
            className={cn(
              "size-5 transition-colors",
              isFavorited
                ? "fill-brand-accent text-brand-accent"
                : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Rating
          value={stay.rating}
          showValue
          count={stay.reviewCount}
          size="md"
        />
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            Up to {stay.maxGuests} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4" />
            {stay.bedrooms} bedroom{stay.bedrooms !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4" />
            {stay.bathrooms} bathroom{stay.bathrooms !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <p className="max-w-3xl text-base leading-7 text-foreground/90">
        {stay.description}
      </p>
    </header>
  );
};

export { StayHeader };

"use client";

import { Heart, MapPin, Star, Volume2, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { StaySummary } from "@/features/stays/types/stay";
import { formatCompactCount, formatMoney, humanizeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StayCardProps {
  stay: StaySummary;
  onFavoriteToggle?: (stayId: string, isFavorited: boolean) => void;
}

const StayCard = ({ stay, onFavoriteToggle }: StayCardProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(stay.isFavorited);

  const handleFavoriteToggle = () => {
    const nextFavorited = !isFavorited;
    setIsFavorited(nextFavorited);
    onFavoriteToggle?.(stay.id, nextFavorited);
  };

  return (
    <Card className="group relative h-full gap-3 pt-0 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-lg">
        <Image
          src={stay.imageUrls[imageIndex] ?? stay.imageUrls[0]}
          alt={stay.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className="bg-card/90 text-foreground shadow-sm backdrop-blur-sm">
            {humanizeLabel(stay.category)}
          </Badge>
          {stay.isNew && (
            <Badge className="bg-card/90 text-foreground shadow-sm backdrop-blur-sm">
              New
            </Badge>
          )}
          {stay.isSuperhost && (
            <Badge className="bg-card/90 text-foreground shadow-sm backdrop-blur-sm">
              Superhost
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleFavoriteToggle}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? "Remove from saved" : "Save stay"}
          className="absolute top-2.5 right-2.5 z-20 flex size-8.5 items-center justify-center rounded-full bg-card/90 shadow-sm backdrop-blur-sm outline-none transition-transform duration-150 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              isFavorited
                ? "fill-brand-accent text-brand-accent"
                : "text-muted-foreground",
            )}
          />
        </button>

        {stay.imageUrls.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            {stay.imageUrls.map((imageUrl, index) => (
              <button
                key={imageUrl}
                type="button"
                onClick={() => setImageIndex(index)}
                aria-label={`Show photo ${index + 1} of ${stay.imageUrls.length}`}
                aria-current={index === imageIndex}
                className="flex items-center justify-center p-1 outline-none focus-visible:opacity-100"
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full bg-card shadow-sm transition-[width,opacity] duration-200",
                    index === imageIndex
                      ? "w-4"
                      : "w-1.5 opacity-65 hover:opacity-100",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {stay.location}, {stay.country}
              </span>
            </p>
            <h3 className="mt-1 truncate font-heading text-lg font-semibold text-foreground">
              <Link
                href={`/stays/${stay.id}`}
                className="outline-none after:absolute after:inset-0 after:z-10"
              >
                {stay.name}
              </Link>
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
            <Star className="size-3.5 fill-gold text-gold" />
            {stay.rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">
              ({formatCompactCount(stay.reviewCount)})
            </span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {stay.tagline}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">
            <Wifi className="size-3" />
            {stay.workSetup.wifiMbps} Mbps
          </Badge>
          <Badge variant="outline">
            <Volume2 className="size-3" />
            Quiet {stay.workSetup.quietScore}
          </Badge>
          <Badge variant="outline">
            {humanizeLabel(stay.workSetup.deskType)}
          </Badge>
        </div>

        <div className="mt-auto flex items-baseline justify-between border-t border-border pt-3">
          <p className="text-foreground">
            <span className="font-heading text-lg font-semibold">
              {formatMoney(stay.pricePerNight)}
            </span>{" "}
            <span className="text-sm text-muted-foreground">/ night</span>
          </p>
          <span className="text-sm text-muted-foreground">
            Up to {stay.maxGuests} guests
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export { StayCard };

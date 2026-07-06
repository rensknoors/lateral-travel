"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type FocusEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STAY_AMENITIES,
  type StayAmenity,
  type StayListFilters,
  type StaySortOption,
} from "@/features/stays/types/stay";
import { humanizeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const SORT_LABELS: Record<StaySortOption, string> = {
  recommended: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

type PriceRange = Pick<StayListFilters, "minPrice" | "maxPrice">;

interface StayFilterBarProps {
  filters: Pick<StayListFilters, "sort" | "minPrice" | "maxPrice" | "amenities">;
  resultCount?: number;
  hasActiveFilters: boolean;
  onSortChange: (sort: StaySortOption) => void;
  onPriceChange: (range: PriceRange) => void;
  onAmenityToggle: (amenity: StayAmenity) => void;
  onClear: () => void;
}

const StayFilterBar = ({
  filters,
  resultCount,
  hasActiveFilters,
  onSortChange,
  onPriceChange,
  onAmenityToggle,
  onClear,
}: StayFilterBarProps) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");

  useEffect(() => {
    setMinPrice(filters.minPrice?.toString() ?? "");
    setMaxPrice(filters.maxPrice?.toString() ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  const commitPriceRange = (event: FocusEvent<HTMLInputElement>) => {
    const nextMin = minPrice ? Number(minPrice) : undefined;
    const nextMax = maxPrice ? Number(maxPrice) : undefined;

    if (nextMin === filters.minPrice && nextMax === filters.maxPrice) return;

    onPriceChange({ minPrice: nextMin, maxPrice: nextMax });
    event.currentTarget.blur();
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {resultCount === undefined
            ? "Searching stays…"
            : `${resultCount} stay${resultCount === 1 ? "" : "s"} found`}
        </p>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={onClear}>
              <X className="size-3.5" />
              Clear filters
            </Button>
          )}
          <Select
            value={filters.sort ?? "recommended"}
            items={SORT_LABELS}
            onValueChange={(value) => value && onSortChange(value)}
          >
            <SelectTrigger aria-label="Sort stays" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min €"
            aria-label="Minimum price per night"
            className="h-8 w-24"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            onBlur={commitPriceRange}
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max €"
            aria-label="Maximum price per night"
            className="h-8 w-24"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            onBlur={commitPriceRange}
          />
          <span className="text-sm text-muted-foreground">/ night</span>
        </div>

        <fieldset className="flex flex-wrap gap-2 border-0 p-0">
          <legend className="sr-only">Filter by amenity</legend>
          {STAY_AMENITIES.map((amenity) => {
            const isActive = filters.amenities?.includes(amenity) ?? false;

            return (
              <button
                key={amenity}
                type="button"
                aria-pressed={isActive}
                onClick={() => onAmenityToggle(amenity)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {humanizeLabel(amenity)}
              </button>
            );
          })}
        </fieldset>
      </div>
    </div>
  );
};

export { StayFilterBar };

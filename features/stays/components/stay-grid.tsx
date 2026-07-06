"use client";

import { CircleAlert, SearchX } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StayCard } from "@/features/stays/components/stay-card";
import { StayCardSkeleton } from "@/features/stays/components/stay-card.skeleton";
import type { StaySummary } from "@/features/stays/types/stay";
import { ApiError } from "@/lib/api-client/api-client";
import { cn } from "@/lib/utils";

const SKELETON_COUNT = 6;
const GRID_CLASSES = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

interface StayGridProps {
  stays: StaySummary[];
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  error?: unknown;
  hasActiveFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onFavoriteToggle?: (stayId: string, isFavorited: boolean) => void;
}

const StayGrid = ({
  stays,
  isLoading,
  isFetching,
  isError,
  error,
  hasActiveFilters,
  onRetry,
  onClearFilters,
  onFavoriteToggle,
}: StayGridProps) => {
  if (isLoading) {
    return (
      <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading stays">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <StayCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError || error instanceof Error
        ? error.message
        : "We couldn't load stays right now.";

    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </AlertAction>
      </Alert>
    );
  }

  if (stays.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No stays match your search</EmptyTitle>
          <EmptyDescription>
            Try a wider price range, fewer amenities, or a nearby location.
          </EmptyDescription>
        </EmptyHeader>
        {hasActiveFilters && (
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear all filters
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  }

  return (
    <div
      className={cn(
        GRID_CLASSES,
        isFetching && "opacity-60 transition-opacity",
      )}
      aria-busy={isFetching}
    >
      {stays.map((stay) => (
        <StayCard
          key={stay.id}
          stay={stay}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export { StayGrid };

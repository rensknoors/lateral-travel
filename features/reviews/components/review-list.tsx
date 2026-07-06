"use client";

import { CircleAlert, MessageSquareText } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Rating } from "@/components/ui/rating";
import { useReviewsQuery } from "@/features/reviews/api/use-review-queries";
import { formatMonthYear } from "@/lib/format";
import { ReviewListSkeleton } from "./review-list.skeleton";

interface ReviewListProps {
  stayId: string;
}

const ReviewList = ({ stayId }: ReviewListProps) => {
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useReviewsQuery(stayId);

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Couldn&apos;t load reviews</AlertTitle>
        <AlertDescription>Please try again.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </AlertAction>
      </Alert>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Empty className="py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareText />
          </EmptyMedia>
          <EmptyTitle>No reviews yet</EmptyTitle>
          <EmptyDescription>
            Be the first to share your experience.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-6">
      {reviews.map((review) => (
        <li key={review.id} className="flex gap-3">
          <Avatar name={review.authorName} size="md" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-medium text-foreground">{review.authorName}</p>
              <span className="text-sm text-muted-foreground">
                {formatMonthYear(review.createdAt)}
              </span>
            </div>
            <Rating value={review.rating} size="sm" />
            <p className="text-sm leading-6 text-foreground/90">
              {review.comment}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export { ReviewList };

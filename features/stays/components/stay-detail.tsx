"use client";

import { CircleAlert } from "lucide-react";

import { ContentContainer } from "@/components/layout/content-container";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReviewSummary } from "@/features/reviews/components/review-summary";
import { useStayQuery } from "@/features/stays/api/use-stay-queries";
import { StayAmenities } from "@/features/stays/components/stay-amenities";
import { StayAvailabilityPanel } from "@/features/stays/components/stay-availability-panel";
import { StayDetailSkeleton } from "@/features/stays/components/stay-detail.skeleton";
import { StayGallery } from "@/features/stays/components/stay-gallery";
import { StayHeader } from "@/features/stays/components/stay-header";
import { StayNotFound } from "@/features/stays/components/stay-not-found";
import { StayPolicies } from "@/features/stays/components/stay-policies";
import { StayWorkSetup } from "@/features/stays/components/stay-work-setup";
import { ApiError } from "@/lib/api/client";

interface StayDetailProps {
  stayId: string;
}

const StayDetail = ({ stayId }: StayDetailProps) => {
  const { data: stay, isLoading, isError, error, refetch } = useStayQuery(stayId);

  if (isLoading) {
    return <StayDetailSkeleton />;
  }

  if (isError) {
    if (error instanceof ApiError && error.code === "not-found") {
      return (
        <ContentContainer size="xl">
          <StayNotFound />
        </ContentContainer>
      );
    }

    const message =
      error instanceof ApiError || error instanceof Error
        ? error.message
        : "We couldn't load this stay right now.";

    return (
      <ContentContainer size="xl" className="py-14">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertAction>
        </Alert>
      </ContentContainer>
    );
  }

  if (!stay) {
    return (
      <ContentContainer size="xl">
        <StayNotFound />
      </ContentContainer>
    );
  }

  return (
    <div className="pb-14">
      <StayGallery name={stay.name} imageUrls={stay.imageUrls} />

      <ContentContainer size="xl" className="mt-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <StayHeader stay={stay} />
            <Separator />
            <StayAmenities amenities={stay.amenities} />
            <Separator />
            <StayWorkSetup workSetup={stay.workSetup} />
            <Separator />
            <StayPolicies
              checkInTime={stay.checkInTime}
              checkOutTime={stay.checkOutTime}
              policies={stay.policies}
            />
            <Separator />
            <ReviewSummary rating={stay.rating} reviewCount={stay.reviewCount} />
          </div>

          <StayAvailabilityPanel stay={stay} />
        </div>
      </ContentContainer>
    </div>
  );
};

export { StayDetail };

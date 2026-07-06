import { Rating } from "@/components/ui/rating";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
}

const ReviewSummary = ({ rating, reviewCount }: ReviewSummaryProps) => (
  <section aria-labelledby="reviews-heading">
    <h2
      id="reviews-heading"
      className="font-heading text-xl font-semibold text-foreground"
    >
      Guest reviews
    </h2>
    <Card className="mt-4">
      <CardContent className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Rating value={rating} showValue count={reviewCount} size="lg" />
        <p className="text-sm text-muted-foreground">
          Based on {reviewCount} verified guest review
          {reviewCount === 1 ? "" : "s"}
        </p>
      </CardContent>
    </Card>
  </section>
);

export { ReviewSummary };

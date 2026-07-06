"use client";

import { CircleAlert, Star } from "lucide-react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddReviewMutation } from "@/features/reviews/api/use-review-queries";
import {
  RATING_VALUES,
  type ReviewRating,
} from "@/features/reviews/types/review";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "@/features/reviews/utils/review-schema";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  stayId: string;
}

const ReviewForm = ({ stayId }: ReviewFormProps) => {
  const {
    mutate: addReview,
    isPending,
    isError,
  } = useAddReviewMutation(stayId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    defaultValues: { authorName: "", rating: 0, comment: "" },
  });

  const rating = watch("rating");

  const onSubmit = (values: ReviewFormValues) => {
    const result = reviewFormSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ReviewFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    addReview(
      { ...result.data, rating: result.data.rating as ReviewRating },
      { onSuccess: () => reset() },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 flex flex-col gap-4"
      noValidate
    >
      <div className="space-y-1.5">
        <label htmlFor="review-author" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="review-author"
          placeholder="Your name"
          aria-invalid={Boolean(errors.authorName)}
          aria-describedby={
            errors.authorName ? "review-author-error" : undefined
          }
          {...register("authorName")}
        />
        {errors.authorName && (
          <p id="review-author-error" className="text-sm text-destructive">
            {errors.authorName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <span id="review-rating-label" className="text-sm font-medium">
          Rating
        </span>
        <div
          role="radiogroup"
          aria-labelledby="review-rating-label"
          aria-describedby={errors.rating ? "review-rating-error" : undefined}
          className="flex items-center gap-1"
        >
          {RATING_VALUES.map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-sm p-0.5 outline-none has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
            >
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() =>
                  setValue("rating", value, { shouldValidate: true })
                }
                className="sr-only"
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              />
              <Star
                className={cn(
                  "size-6 transition-colors",
                  value <= rating
                    ? "fill-gold text-gold"
                    : "text-muted-foreground",
                )}
              />
            </label>
          ))}
        </div>
        {errors.rating && (
          <p id="review-rating-error" className="text-sm text-destructive">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-comment" className="text-sm font-medium">
          Comment
        </label>
        <Textarea
          id="review-comment"
          placeholder="Share what stood out about your stay..."
          rows={4}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          {...register("comment")}
        />
        {errors.comment && (
          <p id="review-comment-error" className="text-sm text-destructive">
            {errors.comment.message}
          </p>
        )}
      </div>

      {isError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Couldn&apos;t submit review</AlertTitle>
          <AlertDescription>Please try again in a moment.</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        variant="accent"
        disabled={isPending}
        className="self-start"
      >
        {isPending ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
};

export { ReviewForm };

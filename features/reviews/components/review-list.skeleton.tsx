import { Skeleton } from "@/components/ui/skeleton";

const ReviewListSkeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-4">
    {Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className="flex gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export { ReviewListSkeleton };

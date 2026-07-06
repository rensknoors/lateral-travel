import { Skeleton } from "@/components/ui/skeleton";
import { StayCardSkeleton } from "@/features/stays/components/stay-card";

const StaysBrowserSkeleton = () => (
  <div aria-hidden="true">
    <Skeleton className="-mt-16 h-[600px] w-full rounded-none pt-16" />

    <div className="border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-7 h-5 w-72" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <StayCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export { StaysBrowserSkeleton };

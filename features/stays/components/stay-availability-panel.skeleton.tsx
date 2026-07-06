import { Skeleton } from "@/components/ui/skeleton";

const StayAvailabilityPanelSkeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-5 w-2/3" />
  </div>
);

export { StayAvailabilityPanelSkeleton };

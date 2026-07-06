import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StayCardSkeleton = () => (
  <Card className="gap-3 pt-0">
    <Skeleton className="aspect-4/3 w-full rounded-t-lg rounded-b-none" />
    <CardContent className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-5 w-3/5" />
        </div>
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);

export { StayCardSkeleton };

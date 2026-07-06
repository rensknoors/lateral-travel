import { ContentContainer } from "@/components/layout/content-container";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StayDetailSkeleton = () => (
  <div aria-hidden="true" className="pb-14">
    <Skeleton className="aspect-21/9 w-full rounded-none sm:aspect-3/1" />

    <ContentContainer size="xl" className="mt-8">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="flex flex-col gap-4 pt-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-11 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </ContentContainer>
  </div>
);

export { StayDetailSkeleton };

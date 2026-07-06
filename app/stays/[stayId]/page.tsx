import { Suspense } from "react";

import { StayDetail } from "@/features/stays/components/stay-detail";
import { StayDetailSkeleton } from "@/features/stays/components/stay-detail.skeleton";

interface StayDetailPageProps {
  params: Promise<{ stayId: string }>;
}

const StayDetailPage = async ({ params }: StayDetailPageProps) => {
  const { stayId } = await params;

  return (
    <Suspense fallback={<StayDetailSkeleton />}>
      <StayDetail stayId={stayId} />
    </Suspense>
  );
};

export default StayDetailPage;

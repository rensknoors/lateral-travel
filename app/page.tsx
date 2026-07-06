import { Suspense } from "react";

import { PopularDestinations } from "@/features/home/components/popular-destinations";
import { WhyLateralTravel } from "@/features/home/components/why-lateral-travel";
import { StaysBrowser } from "@/features/stays/components/stays-browser";
import { StaysBrowserSkeleton } from "@/features/stays/components/stays-browser.skeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={<StaysBrowserSkeleton />}>
        <StaysBrowser />
      </Suspense>
      <PopularDestinations />
      <WhyLateralTravel />
    </>
  );
}

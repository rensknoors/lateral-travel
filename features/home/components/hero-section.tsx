"use client";

import Image from "next/image";

import { StaySearchForm, type StaySearchValues } from "@/features/stays/components/stay-search-form";
import type { StayListFilters } from "@/features/stays/types/stay";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1800&q=80";

interface HeroSectionProps {
  initialValues: Pick<StayListFilters, "query" | "location" | "guests">;
  onSearch: (values: StaySearchValues) => void;
}

const HeroSection = ({ initialValues, onSearch }: HeroSectionProps) => (
  <section className="relative -mt-16 flex min-h-[600px] flex-col items-center justify-center overflow-hidden pt-16">
    <Image
      src={HERO_IMAGE}
      alt="Rolling green mountains at golden hour"
      fill
      priority
      sizes="100vw"
      className="object-cover object-[center_40%]"
    />
    <div
      className="absolute inset-0 bg-linear-to-b from-[rgba(13,47,59,0.22)] to-[rgba(13,47,59,0.55)]"
      aria-hidden
    />

    <div className="relative z-1 mx-auto max-w-[700px] px-6 text-center">
      <p className="mb-5 text-sm font-medium tracking-[0.14em] text-white/80 uppercase">
        Discover your next stay
      </p>
      <h1 className="font-serif text-4xl leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
        The world is wider than you think
      </h1>
      <p className="mt-5 text-lg font-light leading-[1.55] text-white/82">
        Extraordinary places, handpicked for curious travelers.
      </p>
    </div>

    <div className="relative z-1 mt-10 w-full max-w-[860px] px-6">
      <StaySearchForm variant="hero" initialValues={initialValues} onSearch={onSearch} />
    </div>
  </section>
);

export { HeroSection };

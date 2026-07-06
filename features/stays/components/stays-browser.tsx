"use client";

import { useCallback, useRef } from "react";

import { CategoryTabs } from "@/features/home/components/category-tabs";
import { HeroSection } from "@/features/home/components/hero-section";
import { StayFilterBar } from "@/features/stays/components/stay-filter-bar";
import type { StaySearchValues } from "@/features/stays/components/stay-search-form";
import { StayGrid } from "@/features/stays/components/stay-grid";
import { useStayBrowserState } from "@/features/stays/hooks/use-stay-browser-state";
import { ContentContainer } from "@/components/layout/content-container";

const StaysBrowser = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const {
    filters,
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    activeFilters,
    handleSearch,
    handleCategoryChange,
    handleSortChange,
    handlePriceChange,
    handleAmenityToggle,
    handleClearFilters,
    handleFavoriteToggle,
  } = useStayBrowserState();

  const handleHeroSearch = useCallback(
    (values: StaySearchValues) => {
      handleSearch(values);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [handleSearch],
  );

  return (
    <>
      <HeroSection initialValues={filters} onSearch={handleHeroSearch} />
      <CategoryTabs activeCategory={filters.category} onCategoryChange={handleCategoryChange} />

      <ContentContainer ref={resultsRef} size="xl" className="scroll-mt-16 py-12">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-foreground">
              Featured stays
            </h2>
            <p className="mt-1.5 text-muted-foreground">
              Handpicked properties with exceptional hospitality
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <StayFilterBar
            filters={filters}
            resultCount={data?.total}
            hasActiveFilters={activeFilters}
            onSortChange={handleSortChange}
            onPriceChange={handlePriceChange}
            onAmenityToggle={handleAmenityToggle}
            onClear={handleClearFilters}
          />

          <StayGrid
            stays={data?.stays ?? []}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            error={error}
            hasActiveFilters={activeFilters}
            onRetry={refetch}
            onClearFilters={handleClearFilters}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      </ContentContainer>
    </>
  );
};

export { StaysBrowser };

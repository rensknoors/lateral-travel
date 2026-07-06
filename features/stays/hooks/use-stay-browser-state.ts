"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { buildStayListSearchParams } from "@/features/stays/api/stay-api";
import {
  useSetStayFavoriteMutation,
  useStaysQuery,
} from "@/features/stays/api/use-stay-queries";
import type { StayAmenity, StayCategory, StayListFilters, StaySortOption } from "@/features/stays/types/stay";
import { hasActiveStayFilters, parseStayListFilters } from "@/features/stays/utils/stay-filters";
import type { StaySearchValues } from "@/features/stays/components/stay-search-form";

const useStayBrowserState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseStayListFilters(searchParams), [searchParams]);
  const { data, isLoading, isFetching, isError, error, refetch } = useStaysQuery(filters);
  const { mutate: setStayFavorite } = useSetStayFavoriteMutation();

  const applyFilters = useCallback(
    (nextFilters: StayListFilters) => {
      const query = buildStayListSearchParams(nextFilters).toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const handleSearch = useCallback(
    (values: StaySearchValues) => applyFilters({ ...filters, ...values }),
    [applyFilters, filters],
  );

  const handleCategoryChange = useCallback(
    (category: StayCategory | undefined) =>
      applyFilters({ ...filters, category }),
    [applyFilters, filters],
  );

  const handleSortChange = useCallback(
    (sort: StaySortOption) =>
      applyFilters({ ...filters, sort: sort === "recommended" ? undefined : sort }),
    [applyFilters, filters],
  );

  const handlePriceChange = useCallback(
    (range: Pick<StayListFilters, "minPrice" | "maxPrice">) =>
      applyFilters({ ...filters, ...range }),
    [applyFilters, filters],
  );

  const handleAmenityToggle = useCallback(
    (amenity: StayAmenity) => {
      const current = filters.amenities ?? [];
      const nextAmenities = current.includes(amenity)
        ? current.filter((value) => value !== amenity)
        : [...current, amenity];

      applyFilters({ ...filters, amenities: nextAmenities.length ? nextAmenities : undefined });
    },
    [applyFilters, filters],
  );

  const handleClearFilters = useCallback(() => applyFilters({}), [applyFilters]);

  const handleFavoriteToggle = useCallback(
    (stayId: string, isFavorited: boolean) => setStayFavorite({ stayId, isFavorited }),
    [setStayFavorite],
  );

  const activeFilters = hasActiveStayFilters(filters);

  return {
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
  };
};

export { useStayBrowserState };

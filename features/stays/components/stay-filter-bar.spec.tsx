import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StayFilterBar } from "@/features/stays/components/stay-filter-bar";
import type { StayListFilters } from "@/features/stays/types/stay";

const createProps = (
  overrides?: Partial<Parameters<typeof StayFilterBar>[0]>,
) => ({
  filters: {} satisfies Pick<StayListFilters, "sort" | "minPrice" | "maxPrice" | "amenities">,
  resultCount: 12,
  hasActiveFilters: false,
  onSortChange: vi.fn(),
  onPriceChange: vi.fn(),
  onAmenityToggle: vi.fn(),
  onClear: vi.fn(),
  ...overrides,
});

describe("StayFilterBar", () => {
  it("applies the price range when Enter is pressed in the min price field", async () => {
    const user = userEvent.setup();
    const onPriceChange = vi.fn();
    render(
      <StayFilterBar
        {...createProps({ onPriceChange })}
      />,
    );

    await user.type(screen.getByLabelText("Minimum price per night"), "100");
    await user.type(
      screen.getByLabelText("Maximum price per night"),
      "250{Enter}",
    );

    expect(onPriceChange).toHaveBeenCalledWith({ minPrice: 100, maxPrice: 250 });
  });

  it("applies the price range when Enter is pressed in the max price field", async () => {
    const user = userEvent.setup();
    const onPriceChange = vi.fn();
    render(
      <StayFilterBar
        {...createProps({ onPriceChange })}
      />,
    );

    await user.type(screen.getByLabelText("Minimum price per night"), "50");
    await user.type(screen.getByLabelText("Maximum price per night"), "200{Enter}");

    expect(onPriceChange).toHaveBeenCalledWith({ minPrice: 50, maxPrice: 200 });
  });

  it("applies the price range when a price field loses focus", async () => {
    const user = userEvent.setup();
    const onPriceChange = vi.fn();
    render(
      <StayFilterBar
        {...createProps({ onPriceChange })}
      />,
    );

    await user.type(screen.getByLabelText("Minimum price per night"), "75");
    await user.tab();

    expect(onPriceChange).toHaveBeenCalledWith({ minPrice: 75, maxPrice: undefined });
  });

  it("does not call onPriceChange when Enter is pressed without changes", async () => {
    const user = userEvent.setup();
    const onPriceChange = vi.fn();
    render(
      <StayFilterBar
        {...createProps({
          filters: { minPrice: 100, maxPrice: 200 },
          onPriceChange,
        })}
      />,
    );

    await user.click(screen.getByLabelText("Minimum price per night"));
    await user.keyboard("{Enter}");

    expect(onPriceChange).not.toHaveBeenCalled();
  });
});

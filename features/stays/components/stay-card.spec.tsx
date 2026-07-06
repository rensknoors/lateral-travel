import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StayCard } from "@/features/stays/components/stay-card";
import type { StaySummary } from "@/features/stays/types/stay";

const createStaySummary = (overrides?: Partial<StaySummary>): StaySummary => ({
  id: "harbor-loft",
  name: "Harbor Loft",
  category: "apartment",
  location: "Lisbon",
  country: "Portugal",
  tagline: "Bright loft with a river view.",
  imageUrls: ["/img/one.jpg", "/img/two.jpg", "/img/three.jpg"],
  pricePerNight: { amount: 180, currency: "EUR" },
  rating: 4.8,
  reviewCount: 120,
  maxGuests: 2,
  amenities: ["wifi", "desk"],
  workSetup: {
    deskType: "dedicated-desk",
    wifiMbps: 400,
    quietScore: 92,
    hasMonitor: true,
  },
  isFavorited: false,
  isSuperhost: false,
  isNew: false,
  ...overrides,
});

describe("StayCard", () => {
  it("links to the stay detail page", () => {
    render(<StayCard stay={createStaySummary()} />);

    expect(screen.getByRole("link", { name: "Harbor Loft" })).toHaveAttribute(
      "href",
      "/stays/harbor-loft",
    );
  });

  it("shows Superhost and New badges only when flagged", () => {
    const { rerender } = render(<StayCard stay={createStaySummary()} />);

    expect(screen.queryByText("Superhost")).not.toBeInTheDocument();
    expect(screen.queryByText("New")).not.toBeInTheDocument();

    rerender(
      <StayCard stay={createStaySummary({ isSuperhost: true, isNew: true })} />,
    );

    expect(screen.getByText("Superhost")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("toggles favorite state and notifies the callback", () => {
    const onFavoriteToggle = vi.fn<(stayId: string, isFavorited: boolean) => void>();
    render(
      <StayCard stay={createStaySummary()} onFavoriteToggle={onFavoriteToggle} />,
    );

    const favoriteButton = screen.getByRole("button", { name: "Save stay" });
    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(favoriteButton);

    expect(onFavoriteToggle).toHaveBeenCalledWith("harbor-loft", true);
    expect(
      screen.getByRole("button", { name: "Remove from saved" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Remove from saved" }));

    expect(onFavoriteToggle).toHaveBeenLastCalledWith("harbor-loft", false);
  });

  it("switches the visible photo through the gallery dots", () => {
    render(<StayCard stay={createStaySummary()} />);

    expect(screen.getByRole("img", { name: "Harbor Loft" })).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent("/img/one.jpg")),
    );

    fireEvent.click(screen.getByRole("button", { name: "Show photo 2 of 3" }));

    expect(screen.getByRole("img", { name: "Harbor Loft" })).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent("/img/two.jpg")),
    );
  });

  it("hides gallery dots for a single photo", () => {
    render(<StayCard stay={createStaySummary({ imageUrls: ["/img/one.jpg"] })} />);

    expect(
      screen.queryByRole("button", { name: /show photo/i }),
    ).not.toBeInTheDocument();
  });
});

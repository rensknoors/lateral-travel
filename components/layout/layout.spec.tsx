import { render, screen } from "@testing-library/react";
import Link from "next/link";
import { describe, expect, it } from "vitest";

import { ContentContainer } from "@/components/layout/content-container";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";

describe("layout components", () => {
  it("renders the site header with brand and primary navigation", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: /lateral travel/i }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /^stays$/i })[0],
    ).toHaveAttribute("href", "/");
  });

  it("renders a page shell with accessible main content and actions", () => {
    render(
      <PageShell
        eyebrow="Field notes"
        title="Remote-ready stays"
        description="Curated homes with proper desks, reliable wifi and calmer mornings."
        actions={<Link href="/stays">Browse stays</Link>}
      >
        <p>Page content</p>
      </PageShell>,
    );

    expect(screen.getByRole("main")).toHaveTextContent("Page content");
    expect(
      screen.getByRole("heading", { name: "Remote-ready stays" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Field notes")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse stays" })).toHaveAttribute(
      "href",
      "/stays",
    );
  });

  it("constrains content width while preserving custom classes", () => {
    render(
      <ContentContainer className="custom-shell" data-testid="container">
        Contained
      </ContentContainer>,
    );

    expect(screen.getByTestId("container")).toHaveClass("mx-auto");
    expect(screen.getByTestId("container")).toHaveClass("custom-shell");
  });
});

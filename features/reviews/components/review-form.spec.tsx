import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ReviewForm } from "@/features/reviews/components/review-form";
import { renderWithQueryClient } from "@/tests/render-with-query-client";

const RATING_ERROR = "Choose a rating between 1 and 5 stars.";

describe("ReviewForm", () => {
  it("clears the rating error when a rating is selected", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<ReviewForm stayId="stay-1" />);

    await user.type(screen.getByLabelText("Name"), "Maria");
    await user.type(
      screen.getByLabelText("Comment"),
      "Loved the quiet workspace and reliable wifi throughout the stay.",
    );
    await user.click(screen.getByRole("button", { name: "Submit review" }));

    expect(await screen.findByText(RATING_ERROR)).toBeVisible();

    await user.click(screen.getByLabelText("5 stars"));

    await waitFor(() => {
      expect(screen.queryByText(RATING_ERROR)).not.toBeInTheDocument();
    });
  });
});

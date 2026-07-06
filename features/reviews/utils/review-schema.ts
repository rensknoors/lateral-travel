import { z } from "zod";

const MIN_COMMENT_LENGTH = 20;
const MAX_COMMENT_LENGTH = 1000;

const BLOCKED_TERMS = [
  "buy followers",
  "click here",
  "crypto giveaway",
  "free money",
  "fuck",
  "scam",
  "shit",
  "viagra",
  "www.",
];

const containsBlockedContent = (comment: string) => {
  const normalized = comment.toLowerCase();
  return BLOCKED_TERMS.some((term) => normalized.includes(term));
};

export const reviewFormSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters).")
    .max(60, "Name must be 60 characters or fewer."),
  rating: z
    .number()
    .int("Choose a rating between 1 and 5 stars.")
    .min(1, "Choose a rating between 1 and 5 stars.")
    .max(5, "Choose a rating between 1 and 5 stars."),
  comment: z
    .string()
    .trim()
    .min(
      MIN_COMMENT_LENGTH,
      `Share at least ${MIN_COMMENT_LENGTH} characters so other guests know what to expect.`,
    )
    .max(MAX_COMMENT_LENGTH, `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`)
    .refine((comment) => !containsBlockedContent(comment), {
      message: "Please remove inappropriate or spammy language from your review.",
    }),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

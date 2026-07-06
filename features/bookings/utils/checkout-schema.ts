import { z } from "zod";

export const checkoutFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  termsAccepted: z.boolean().refine((value) => value, {
    message: "Accept the terms to continue.",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

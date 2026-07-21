import { z } from "zod";

export const guestDetailsSchema = z
  .object({
    full_name: z.string().min(2, "Enter the primary guest's full name"),

    email: z.string().email("Enter a valid email address"),

    phone_number: z.string().min(10, "Enter a valid phone number"),

    alternate_phone_number: z.string().optional(),

    special_requirements: z.string().optional(),

    arrival_notes: z.string().optional(),

    event_notes: z.string().optional(),

    terms: z.boolean(),
    cancellation: z.boolean(),
    houseRules: z.boolean(),
    privacy: z.boolean(),
  })
  .refine((data) => data.terms, {
    message: "You must accept the Terms & Conditions",
    path: ["terms"],
  })
  .refine((data) => data.cancellation, {
    message: "You must acknowledge the Cancellation Policy",
    path: ["cancellation"],
  })
  .refine((data) => data.houseRules, {
    message: "You must acknowledge the House Rules",
    path: ["houseRules"],
  })
  .refine((data) => data.privacy, {
    message: "You must acknowledge the Privacy Policy",
    path: ["privacy"],
  });

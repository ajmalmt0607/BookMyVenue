import { z } from "zod";

export const signupSchema = z
  .object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),

    email: z
      .string()
      .email(),

    phone_number: z
      .string()
      .min(10),

    password: z
      .string()
      .min(8),

    confirm_password: z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirm_password,
    {
      message:
        "Passwords do not match",
      path: [
        "confirm_password",
      ],
    }
  );

export const loginSchema =
  z.object({
    email: z
      .string()
      .email(),

    password: z
      .string()
      .min(1, "Password is required"),
  });
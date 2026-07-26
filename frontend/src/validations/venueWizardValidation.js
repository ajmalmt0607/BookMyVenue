import { z } from "zod";

export const basicInfoSchema = z.object({
  venue_type_id: z.string().min(1, "Select a venue type"),

  name: z.string().min(3, "Enter a venue name"),

  description: z.string().min(20, "Description must be at least 20 characters"),

  venue_address: z.string().min(5, "Enter the venue's address"),

  location_name: z.string().min(2, "Enter a location/area name"),

  location_address: z
    .string()
    .min(5, "Pin your venue's location on the map"),

  city: z.string().min(2, "Enter a city"),

  district: z.string().optional().nullable(),

  state: z.string().min(2, "Enter a state"),

  country: z.string().min(2, "Enter a country"),

  latitude: z.number({
    invalid_type_error: "Pick your venue's location on the map",
  }),

  longitude: z.number({
    invalid_type_error: "Pick your venue's location on the map",
  }),

  min_capacity: z.coerce
    .number({ invalid_type_error: "Enter the minimum capacity" })
    .int()
    .positive("Must be at least 1"),

  max_capacity: z.coerce
    .number({ invalid_type_error: "Enter the maximum capacity" })
    .int()
    .positive("Must be at least 1"),
})
  .refine((data) => data.max_capacity >= data.min_capacity, {
    message: "Maximum capacity cannot be less than minimum capacity",
    path: ["max_capacity"],
  });

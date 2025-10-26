import { z } from "zod";

export const regionSchema = z.object({
  name: z
    .string()
    .min(3, "Region name must be at least 3 characters")
    .max(50, "Region name must be less than 50 characters")
    .trim(),
  status: z.enum(["active", "inactive"]).optional(),
  id: z.string().optional(),
});

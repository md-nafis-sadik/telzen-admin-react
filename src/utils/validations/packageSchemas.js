import { z } from "zod";

const PriceSchema = z.object({
  USD: z.number().min(0, "USD price must be positive"),
  EUR: z.number().min(0, "EUR price must be positive"),
});

export const PackageSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["data", "voice"], {
    errorMap: () => ({ message: "Invalid package type" }),
  }),
  data_plan_in_mb: z.number().min(0, "Data plan must be at least 1MB"),
  bonus_data_plan_in_mb: z.number().min(0).default(0),
  validity: z.object({
    amount: z.number().min(0, "Validity must be at least 1"),
    type: z.enum(["day", "week", "month", "year"]),
  }),
  status: z.enum(["active", "inactive"]),
  coverage_countries: z
    .array(z.string())
    .min(1, "At least one country must be selected"),
  original_price: PriceSchema,
  price: PriceSchema,
  vat: z
    .object({
      amount: z.number().min(0).max(100).default(0),
    })
    .optional(),
  is_auto_renew_available: z.boolean().default(true),
  discount: z
    .object({
      amount: z
        .number()
        .min(0)
        .max(100, "Discount cannot exceed 100%")
        .default(0),
    })
    .optional(),
  vendor_type: z.string().min(0, "Vendor type is required").default("telnyx"),
  note: z.string().optional(),
  id: z.string().optional(),
});

export const AddPackageSchema = PackageSchema.omit({ id: true });
export const UpdatePackageSchema = PackageSchema.required({ id: true });

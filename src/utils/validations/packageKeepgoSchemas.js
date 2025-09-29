import { z } from "zod";

// 1. First create the base schema
const BasePackageKeepgoSchema = z.object({
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
  coverage_countries: z.array(z.string()).optional(),
  coverage_regions: z.array(z.string()).optional(),
  original_price: z.object({
    USD: z.number().min(0, "Original price must be positive"),
  }),
  price: z.object({
    USD: z.number().min(0, "Price must be positive"),
    EUR: z.number().min(0, "Price must be positive").optional(),
  }),
  vat: z
    .object({
      amount: z.number().min(0).max(100).default(0),
    })
    .optional(),
  is_auto_renew_available: z.boolean().default(false),
  discount: z
    .object({
      amount: z
        .number()
        .min(0)
        .max(100, "Discount cannot exceed 100%")
        .default(0),
    })
    .optional(),
  vendor_type: z.string().min(1, "Vendor type is required").default("keep-go"),
  note: z.string().optional(),
  keep_go_bundle_id: z.string().nonempty("Bundle ID is required"),
  id: z.string(),
  keep_go_bundle_type: z.string(),

});


const BasePackageUpKeepgoSchema = z.object({
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
  coverage_countries: z.array(z.string()).optional(),
  coverage_regions: z.array(z.string()).optional(),
  original_price: z.object({
    USD: z.number().min(0, "Original price must be positive"),
  }),
  price: z.object({
    USD: z.number().min(0, "Price must be positive"),
    EUR: z.number().min(0, "Price must be positive").optional(),
  }),
  vat: z
    .object({
      amount: z.number().min(0).max(100).default(0),
    })
    .optional(),
  is_auto_renew_available: z.boolean().default(false),
  discount: z
    .object({
      amount: z
        .number()
        .min(0)
        .max(100, "Discount cannot exceed 100%")
        .default(0),
    })
    .optional(),
  vendor_type: z.string().min(1, "Vendor type is required").default("keep-go"),
  note: z.string().optional(),
  id: z.string(),
});


export const AddKeepgoPackageSchema = BasePackageKeepgoSchema.omit({ id: true });
export const UpdateKeepgoPackageSchema = BasePackageUpKeepgoSchema.required({
  id: true,
});
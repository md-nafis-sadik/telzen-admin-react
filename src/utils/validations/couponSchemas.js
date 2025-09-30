import dayjs from "dayjs";
import { z } from "zod";

const BaseCouponSchema = z.object({
  is_private: z.boolean(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  code: z.string().min(1, "Code is required"),
  discount: z.object({
    amount: z
      .number()
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%"),
  }),
  validity_end_at: z
    .number()
    .min(dayjs().unix(), "End date must be in the future"),
  coverage_countries: z.array(z.string()),
  max_usages_limit: z.union([
    z.number().min(1, "Usage limit must be at least 1"),
    z
      .string()
      .transform((val) => (val === "" ? undefined : Number(val)))
      .refine((val) => val === undefined || val >= 1, {
        message: "Usage limit must be at least 1",
      }),
  ]),
});

const validateCoverageCountries = (data) => {
  // If not private, coverage_countries must have at least one country
  if (!data.is_private && data.coverage_countries.length === 0) {
    return false;
  }
  return true;
};

export const AddCouponSchema = BaseCouponSchema.refine(
  validateCoverageCountries,
  {
    message: "At least one country must be selected for public coupons",
    path: ["coverage_countries"],
  }
);

export const UpdateCouponSchema = BaseCouponSchema.extend({
  _id: z.string(),
}).refine(validateCoverageCountries, {
  message: "At least one country must be selected for public coupons",
  path: ["coverage_countries"],
});

export const CouponSchema = BaseCouponSchema.extend({
  _id: z.string().optional(),
}).refine(validateCoverageCountries, {
  message: "At least one country must be selected for public coupons",
  path: ["coverage_countries"],
});

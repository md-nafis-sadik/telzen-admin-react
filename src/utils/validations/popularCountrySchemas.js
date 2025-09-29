import { z } from "zod";

export const PopularCountryBaseSchema = z.object({
  code: z.string().min(1, "PopularCountry code is required"),
  name: z.string().min(1, "PopularCountry name is required"),
  flag: z.string().min(1, "Flag is required"),
});

export const RegionSchema = z.object({
  _id: z.string().min(1, "Region ID is required"),
  name: z.string().min(1, "Region name is required"),
});

// For API data (nested structure)
export const PopularCountryFormInputSchema = z.object({
  country: z.string().min(1, "PopularCountry is required"),
  region: z.string().min(1, "Region is required"),
  discount: z
    .union([
      z
        .number()
        .min(0, "Discount must be at least 0")
        .max(100, "Discount cannot exceed 100%"),
      z
        .string()
        .transform((val) => (val === "" ? null : Number(val)))
        .refine(
          (val) => val === null || (!isNaN(val) && val >= 0 && val <= 100),
          {
            message: "Discount must be between 0 and 100",
          }
        ),
      z.null(),
    ])
    .optional(),
  popular: z.enum(["yes", "no"]),
  _id: z.string().optional(),
});

// For form input transformation
export const transformFormDataToAPI = (formData, countries) => {
  const selectedPopularCountry = countries.find((c) => c.code === formData.country);

  // Handle discount - if it's null, undefined, or empty string, set to null
  const discountAmount =
    formData.discount === null ||
    formData.discount === undefined ||
    formData.discount === ""
      ? null
      : Number(formData.discount);

  return {
    code: selectedPopularCountry.code,
    name: selectedPopularCountry.name,
    flag: selectedPopularCountry.flag,
    region: formData.region,
    discount:
      discountAmount !== null
        ? {
            amount: discountAmount,
            currency: "USD", // or your default currency
          }
        : null,
    is_popular: formData.popular === "yes",
  };
};

export const AddPopularCountrySchema = z.object({
  country_id: z.string().min(1, "Country is required"),
  feature_countries: z
    .array(z.string())
    .min(1, "At least one feature country is required"),
});
export const UpdatePopularCountrySchema = z.object({
  country_id: z.string().min(1, "Country is required"),
  feature_countries: z
    .array(z.string())
    .min(1, "At least one feature country is required"),
});
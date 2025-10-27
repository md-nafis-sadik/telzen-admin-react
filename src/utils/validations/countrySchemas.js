import { z } from "zod";

// Schema for the form data structure
// countrySchema.js
export const CountryFormSchema = z.object({
  code: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  id: z.string().optional(),
  name: z.string().optional(),
  is_popular: z.boolean().optional(),
});

// For API data transformation
export const transformFormDataToAPI = (formData, countries) => {
  const selectedCountry = countries.find((c) => c.code === formData.code);

  return {
    code: selectedCountry?.code || formData.code,
    name: selectedCountry?.name || "",
    flag: selectedCountry?.flag || "",
    region: formData.region,
    is_popular: formData.is_popular || false,
  };
};

export const AddCountrySchema = CountryFormSchema.omit({
  id: true,
  name: true,
  image: true,
});
export const UpdateCountrySchema = CountryFormSchema.required({ id: true });

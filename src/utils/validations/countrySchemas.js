import { z } from "zod";

// Schema for the form data structure
// countrySchema.js
export const CountryFormSchema = z.object({
  code: z.string().min(1, "Country is required"), // Changed from 'country' to 'code'
  region: z.string().min(1, "Region is required"),
  _id: z.string().optional(),
});

// For API data transformation
export const transformFormDataToAPI = (formData, countries) => {
  const selectedCountry = countries.find((c) => c.code === formData.code); // Changed to formData.code

  return {
    code: selectedCountry?.code || formData.code,
    name: selectedCountry?.name || "",
    flag: selectedCountry?.flag || "",
    region: formData.region,
  };
};

export const AddCountrySchema = CountryFormSchema.omit({ _id: true });
export const UpdateCountrySchema = CountryFormSchema.required({ _id: true });

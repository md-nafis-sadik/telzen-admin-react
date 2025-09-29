import { z } from 'zod';

// Schema for the form data structure
// countrySchema.js
export const CountryFormSchema = z.object({
  code: z.string().min(1, 'Country is required'), // Changed from 'country' to 'code'
  region: z.string().min(1, 'Region is required'),
  discount: z.union([
    z.number()
      .min(0, 'Discount must be at least 0')
      .max(100, 'Discount cannot exceed 100%'),
    z.string()
      .transform((val) => (val === '' ? null : Number(val)))
      .refine((val) => val === null || (!isNaN(val) && val >= 0 && val <= 100), {
        message: 'Discount must be between 0 and 100',
      }),
  ]).nullable().optional(),
  popular: z.enum(['yes', 'no']),
  _id: z.string().optional(),
});

// For API data transformation
export const transformFormDataToAPI = (formData, countries) => {
  const selectedCountry = countries.find((c) => c.code === formData.code); // Changed to formData.code

  // Handle discount - convert to null if empty, undefined, or NaN
  let discountAmount = null;
  if (formData.discount !== null && formData.discount !== undefined && formData.discount !== '') {
    const numValue = Number(formData.discount);
    discountAmount = isNaN(numValue) ? null : numValue;
  }

  return {
    code: selectedCountry?.code || formData.code,
    name: selectedCountry?.name || '',
    flag: selectedCountry?.flag || '',
    region: formData.region,
    discount: discountAmount,
    is_popular: formData.popular === 'yes',
  };
};

export const AddCountrySchema = CountryFormSchema.omit({ _id: true });
export const UpdateCountrySchema = CountryFormSchema.required({ _id: true });
import { z } from "zod";

// Helper to convert empty string to undefined for optional number fields
const optionalNumber = z
  .union([
    z.string().transform((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }),
    z.number(),
  ])
  .optional();

// Helper for required number fields that accepts empty strings initially
const requiredNumber = (errorMessage) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number({ required_error: errorMessage, invalid_type_error: errorMessage }));

// Helper for positive numbers
const positiveNumber = (errorMessage, minValue = 0) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number({ required_error: errorMessage }).min(minValue, errorMessage));

// 1. Base Package Schema with conditional validation
const BasePackageSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["data", "voice"], {
    errorMap: () => ({ message: "Invalid package type" }),
  }),
  data_plan_in_mb: positiveNumber(
    "Data plan is required and must be at least 1MB",
    1
  ),
  bonus_data_plan_in_mb: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().min(0).default(0)),
  validity: z.object({
    amount: positiveNumber(
      "Validity amount is required and must be at least 1",
      1
    ),
    type: z.enum(["day", "week", "month", "year"], {
      errorMap: () => ({ message: "Invalid validity type" }),
    }),
  }),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  coverage_countries: z.array(z.string()).optional(),
  coverage_regions: z.array(z.string()).optional(),
  retail_price: z.object({
    USD: positiveNumber("Retail price is required and must be positive", 0.01),
  }),
  selling_price: z.object({
    USD: positiveNumber("Selling price is required and must be positive", 0.01),
    BDT: positiveNumber("Selling price (BDT) is required and must be positive", 0.01),
  }),
  is_auto_renew_available: z.boolean().default(false),
  discount_on_selling_price: z.object({
    amount: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    }, z.number().min(0, "Discount must be 0 or positive").default(0)),
    is_type_percentage: z.boolean().default(true),
  }),
  on_purchase_reward_point: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().min(0, "Reward points must be 0 or positive").default(0)),
  package_code: z.string().min(1, "Package selection is required"),
  id: z.string(),
  coverage_type: z.string(),
  slug: z.string(),
});

// 2. Base Package Update/Keepgo Schema
const BasePackageUpKeepgoSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["data", "voice"], {
    errorMap: () => ({ message: "Invalid package type" }),
  }),
  data_plan_in_mb: positiveNumber(
    "Data plan is required and must be at least 1MB",
    1
  ),
  bonus_data_plan_in_mb: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().min(0).default(0)),
  validity: z.object({
    amount: positiveNumber(
      "Validity amount is required and must be at least 1",
      1
    ),
    type: z.enum(["day", "week", "month", "year"], {
      errorMap: () => ({ message: "Invalid validity type" }),
    }),
  }),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  coverage_countries: z.array(z.string()).optional(),
  coverage_regions: z.array(z.string()).optional(),
  retail_price: z.object({
    USD: positiveNumber(
      "Original price is required and must be positive",
      0.01
    ),
  }),
  selling_price: z.object({
    USD: positiveNumber("Price is required and must be positive", 0.01),
    BDT: positiveNumber("Price (BDT) is required and must be positive", 0.01),
  }),
  // vat_on_selling_price: z
  //   .object({
  //     amount: z.preprocess((val) => {
  //       if (val === "" || val === null || val === undefined) return 0;
  //       const num = Number(val);
  //       return isNaN(num) ? 0 : num;
  //     }, z.number().min(0).max(100, "VAT cannot exceed 100%").default(0)),
  //     is_type_percentage: z.boolean().default(true),
  //   })
  //   .optional(),
  is_auto_renew_available: z.boolean().default(false),
  discount_on_selling_price: z
    .object({
      amount: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return 0;
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      }, z.number().min(0).max(100, "Discount cannot exceed 100%").default(0)),
      is_type_percentage: z.boolean().default(true),
    })
    .optional(),
  on_purchase_reward_point: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().min(0, "Reward points must be 0 or positive").default(0)),
  note: z.string().optional(),
  id: z.string(),
});

export const AddPackageSchema = BasePackageSchema.omit({ id: true }).refine((data) => {
  // Conditional validation based on coverage_type
  if (data.coverage_type === "country") {
    // For country packages, both countries and regions are required
    if (!data.coverage_countries || data.coverage_countries.length === 0) {
      return false;
    }
    if (!data.coverage_regions || data.coverage_regions.length === 0) {
      return false;
    }
  } else if (data.coverage_type === "regional") {
    // For regional packages, only regions are required
    if (!data.coverage_regions || data.coverage_regions.length === 0) {
      return false;
    }
  }
  return true;
}, {
  message: "Coverage selection is required based on package type",
  path: ["coverage_countries"], // This will show error on countries field by default
});

export const UpdatePackageSchema = BasePackageUpKeepgoSchema.required({
  id: true,
}).refine((data) => {
  // Conditional validation based on coverage_type
  if (data.coverage_type === "country") {
    // For country packages, both countries and regions are required
    if (!data.coverage_countries || data.coverage_countries.length === 0) {
      return false;
    }
    if (!data.coverage_regions || data.coverage_regions.length === 0) {
      return false;
    }
  } else if (data.coverage_type === "regional") {
    
    if (!data.coverage_regions || data.coverage_regions.length === 0) {
      return false;
    }
  }
  return true;
}, {
  message: "Coverage selection is required based on package type",
  path: ["coverage_countries"], 
});

export const validatePackageCoverage = (data) => {
  if (data.coverage_type === "country") {
    
    if (!data.coverage_countries || data.coverage_countries.length === 0) {
      return { 
        isValid: false, 
        error: "At least one coverage country is required for country packages",
        field: "coverage_countries"
      };
    }
    if (!data.coverage_regions || data.coverage_regions.length === 0) {
      return { 
        isValid: false, 
        error: "Coverage regions are automatically selected based on countries",
        field: "coverage_regions"
      };
    }
  } else if (data.coverage_type === "regional") {
    
    if (!data.coverage_regions || data.coverage_regions.length === 0) {
      return { 
        isValid: false, 
        error: "At least one coverage region is required for regional packages",
        field: "coverage_regions"
      };
    }
  }
  return { isValid: true };
};

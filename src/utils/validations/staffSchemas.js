import { z } from "zod";

export const CountrySchema = z.object({
  code: z.string().min(1, "Country code is required"),
  name: z.string().min(1, "Country name is required"),
  dial_code: z.string().min(1, "Dial code is required"),
});

export const StaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  country: CountrySchema,
  role: z.string().min(1, "Role is required"),
  _id: z.string().optional(),
});

export const AddStaffSchema = StaffSchema.omit({ _id: true });
export const UpdateStaffSchema = StaffSchema.required({ _id: true });

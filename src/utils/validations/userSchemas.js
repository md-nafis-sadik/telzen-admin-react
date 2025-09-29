// import { z } from "zod";

// export const UserSchema = z.object({
//     fullName: z.string().min(1, "Full name is required."),
//     email: z.string().email("Invalid email address."),
//     phone: z.string().min(1, "Phone number is required."),
//     role: z.object({
//         value: z.string().min(1, "Role is required.")
//     }),
// });

// export const AddUserSchema = UserSchema.pick({
//     fullName: true,
//     email: true,
//     phone: true,
//     role: true
// });

// export const UpdateUserSchema = UserSchema.pick({
//     fullName: true,
//     email: true,
//     phone: true,
//     role: true
// });

// export const UpdateEmailSchema = z.object({
//     currentEmail: z.string().email("Invalid current email address."),
//     newEmail: z.string().email("Invalid email address."),
// });

// export const UpdatePasswordSchema = z.object({
//     currentPassword: z.string().min(1, "Current password is required."),
//     newPassword: z.string().min(6, "New password must be at least 6 characters."),
//     confirmPassword: z.string().min(1, "Confirm password is required."),
// }).refine((data) => data.newPassword === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match.",
// });

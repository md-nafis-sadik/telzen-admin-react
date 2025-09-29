import { z } from "zod";

export const NotificationSchema = z
  .object({
    title: z.string().min(1, "Title is required").trim(),
    message: z.string().min(1, "Message is required").trim(),
    recipient_type: z.enum(["all", "custom"]),
    userIds: z.array(z.string()).min(1, "At least one user must be selected"),
    file: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => {
          if (!file) return true; // File is optional
          const validTypes = ["image/jpeg", "image/png", "image/jpg"];
          return validTypes.includes(file.type);
        },
        {
          message: "Only JPG, JPEG or PNG files are supported",
        }
      ),
  })
  .refine(
    (data) =>
      data.recipient_type !== "custom" ||
      (data.recipient_type === "custom" && data.userIds.length > 0),
    {
      message: "Select at least one user when recipient type is custom",
      path: ["userIds"],
    }
  );

export const AddNotificationSchema = NotificationSchema;

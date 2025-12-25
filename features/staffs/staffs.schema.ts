import { z } from "zod";

export const staffSchema = z.object({
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  dateOfBirth: z.date().optional().or(z.null()),
  address: z.string().optional(),
  gender: z.string().optional(),
  role: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;


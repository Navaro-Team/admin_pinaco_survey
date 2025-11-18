import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ")
    .trim(),
  password: z.string().min(1, "Mật khẩu là bắt buộc")
    .trim(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
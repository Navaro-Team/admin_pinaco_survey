import { z } from "zod";

// User Status enum values
export const UserStatusEnum = z.enum([
  'active',
  'inactive',
  'suspended',
  'banned',
  'deleted',
  'locked',
  'requires_re_authentication'
]);

// Gender enum
export const GenderEnum = z.enum(['male', 'female', 'other']);

// Auth method enum
export const AuthMethodEnum = z.enum(['email', 'phone']);

// Roles array
const rolesArray = z.array(z.string()).optional();

// Base schema for staff form
export const staffFormSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên không được vượt quá 50 ký tự"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().regex(/^(0[3-9][0-9]{8,9})$/, "Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx)").optional().or(z.literal("")),
  code: z.string().min(1, "Mã nhân sự phải có ít nhất 2 ký tự").max(50, "Mã nhân sự không được vượt quá 50 ký tự"),
  dateOfBirth: z.date({ message: "Ngày sinh là bắt buộc" }),
  address: z.string().optional().or(z.literal("")),
  gender: GenderEnum.optional().nullable(),
  password: z.string().optional(),
  roles: rolesArray,
  status: UserStatusEnum.optional(),
  authMethod: AuthMethodEnum.optional(),
  isEmailVerified: z.boolean().optional(),
}).refine((data) => {
  return !!(data.email && data.email.trim() !== '') || !!(data.phone && data.phone.trim() !== '');
}, {
  message: "Vui lòng nhập email hoặc số điện thoại",
  path: ["email"]
});

export type StaffFormData = z.infer<typeof staffFormSchema>;

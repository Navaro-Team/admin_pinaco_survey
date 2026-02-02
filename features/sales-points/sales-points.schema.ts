import { z } from "zod";

export const initialValues = {
  name: "",
  code: "",
  address: "",
  salesScale: 0,
  contactPersonName: "",
  phone: "",
  sellerName: "",
  supplierCode: "",
  supplierName: "",
};

export const salesPointSchema = z.object({
  name: z.string().min(1, "Tên điểm bán là bắt buộc"),
  code: z.string().optional(),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  salesScale: z.number().optional(),
  contactPersonName: z.string().optional(),
  phone: z.string().optional(),
  sellerName: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
});

export type SalesPointFormData = z.infer<typeof salesPointSchema>;


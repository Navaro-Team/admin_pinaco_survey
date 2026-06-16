import { z } from "zod";

export const initialValues = {
  name: "",
  code: "",
  address: "",
  salesScale: 0,
  contactPersonName: "",
  phone: "",
  sellerName: "",
  sellerCode: "",
  supplierCode: "",
  supplierName: "",
  province: "",
  area: "",
  type: "",
};

export const salesPointSchema = z.object({
  name: z.string().min(1, "Tên điểm bán là bắt buộc"),
  code: z.string().optional(),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  salesScale: z.number().optional(),
  contactPersonName: z.string().optional(),
  phone: z.string().optional(),
  sellerName: z.string().optional(),
  sellerCode: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
  province: z.string().optional(),
  area: z.string().optional(),
  type: z.string().min(1, "Loại cửa hàng là bắt buộc"),

});

export type SalesPointFormData = z.infer<typeof salesPointSchema>;


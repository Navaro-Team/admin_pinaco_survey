import { z } from "zod";

export const aiConfigFormSchema = z.object({
  modelName: z.string().min(1, "Vui lòng nhập tên model"),
  apiKey: z.string().optional(),
  isActive: z.boolean(),
  rpmLimit: z.number().int().min(1, "Phải lớn hơn 0"),
  rpdLimit: z.number().int().min(1, "Phải lớn hơn 0"),
});

export type AiConfigFormData = z.infer<typeof aiConfigFormSchema>;

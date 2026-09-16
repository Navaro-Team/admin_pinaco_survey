import { z } from "zod";

export const aiConfigFormSchema = z.object({
  modelName: z.string().min(1, "Vui lòng nhập tên model"),
  apiKey: z.string().optional(),
  isActive: z.boolean(),
});

export type AiConfigFormData = z.infer<typeof aiConfigFormSchema>;

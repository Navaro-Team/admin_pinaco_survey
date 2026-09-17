"use client"

import { useEffect } from "react";
import { AiConfigForm } from "@/components/ai-config/AiConfigForm";
import { useAppDispatch } from "@/hooks/redux";
import { getAiConfig } from "@/features/ai-config/ai-config.slice";

export default function Page() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAiConfig({}));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Cấu hình AI</h1>
        <p className="text-base text-muted-foreground">
          Cấu hình model và API key dùng để AI phân loại chủ đề cho báo cáo phân tích câu hỏi mở (Câu 16).
        </p>
      </div>
      <AiConfigForm />
    </div>
  )
}

"use client"

import Image from "next/image";
import { formatUTCDate } from "@/lib/utils";

const IMAGE_TYPE_LABEL_MAP = {
  "toan_canh": "Toàn cảnh",
  "ke_trung_bay": "Kệ trưng bày",
  "kho_hang": "Kho hàng",
} as const;

interface FileUploadAnswerProps {
  question: any;
  answerValue: any;
}

export function FileUploadAnswer({ answerValue }: FileUploadAnswerProps) {
  if (!Array.isArray(answerValue) || answerValue.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {answerValue.map((asset: any, idx: number) => {
        const source = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}${asset.path}`;
        const imageType = asset.meta?.imageType as keyof typeof IMAGE_TYPE_LABEL_MAP | undefined;
        const imageTypeLabel = imageType ? IMAGE_TYPE_LABEL_MAP[imageType] : undefined;
        const capturedAt = asset.capturedAt ? formatUTCDate(asset.capturedAt, "dd/MM/yyyy HH:mm") : undefined;
        const name = asset.originalName || asset.filename || "";

        return (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <Image
              src={source}
              alt={name || idx.toString()}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100">
              <div className="w-full bg-black/60 px-2 py-1 space-y-0.5">
                {name && (
                  <div className="text-[11px] text-white truncate" title={name}>
                    {name}
                  </div>
                )}
                {capturedAt && (
                  <div className="text-[10px] text-gray-200">
                    {capturedAt}
                  </div>
                )}
                {imageTypeLabel && (
                  <div className="text-[10px] text-emerald-300">
                    {imageTypeLabel}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


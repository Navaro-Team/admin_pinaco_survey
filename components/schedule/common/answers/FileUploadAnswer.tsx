"use client"

import Image from "next/image";

interface FileUploadAnswerProps {
  question: any;
  answerValue: any;
}

export function FileUploadAnswer({ answerValue }: FileUploadAnswerProps) {
  if (!Array.isArray(answerValue) || answerValue.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {answerValue.map((asset: any, idx: number) => {
        const source = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/${asset}`
        return (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <Image
              src={source}
              alt={idx.toString()}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs text-center px-2">{idx.toString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


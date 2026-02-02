"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux";
import { formatUTCDate } from "@/lib/utils";
import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";

const IMAGE_TYPE_LABEL_MAP = {
  "toan_canh": "Toàn cảnh",
  "xung_quanh": "Khung cảnh xung quanh",
  "vi_tri": "Vị trí",
} as const;

export function PhotoCheckIn() {
  const task = useAppSelector((state) => state.schedule.task);
  const checkInAssets = task?.checkInAssets || [];

  return (
    <Card hidden={checkInAssets.length === 0} className="flex flex-col gap-4!">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <IconPhoto className="size-6 text-main" />
          <span>Hình ảnh check-in</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col py-2! gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {checkInAssets.map((asset: any, idx: number) => {
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
      </CardContent>
    </Card >
  )
}
"use client";

import { formatDate } from "date-fns";
import { useAppSelector } from "@/hooks/redux";
import { ExportSubmissionButton } from "./ExportSubmissionButton";

export function PendingReviewHeader() {
  const filter = useAppSelector((state) => state.submission.filter);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Danh sách câu trả lời</h1>
        <p className="text-base text-muted-foreground">
          Xem, lọc và quản lý danh sách các khảo sát đã được gửi về
        </p>
      </div>
      <ExportSubmissionButton
        filter={{
          q: filter.store || undefined,
          region: filter.area || undefined,
          status: filter.status || undefined,
          startDate: filter.dateRange?.from ? formatDate(filter.dateRange.from, "yyyy-MM-dd") : undefined,
          endDate: filter.dateRange?.to ? formatDate(filter.dateRange.to, "yyyy-MM-dd") : undefined,
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatDate } from "date-fns";
import { Trash2, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getPendingSubmissions } from "@/features/submission/submission.slice";
import type { CleanupAction } from "@/features/survey-cleanup/survey-cleanup.types";
import { Button } from "../ui/button";
import { ExportSubmissionButton } from "./ExportSubmissionButton";
import { SurveyCleanupDialog } from "./SurveyCleanupDialog";

export function PendingReviewHeader() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.submission.filter);
  const pagination = useAppSelector((state) => state.submission.pagination);
  const [cleanupAction, setCleanupAction] = useState<CleanupAction | null>(null);

  const startDate = filter.dateRange?.from ? formatDate(filter.dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = filter.dateRange?.to ? formatDate(filter.dateRange.to, "yyyy-MM-dd") : undefined;

  const reloadSubmissions = () => {
    dispatch(getPendingSubmissions({
      page: pagination.page,
      limit: pagination.limit,
      q: filter.store || undefined,
      area: filter.area || undefined,
      status: filter.status || undefined,
      dateRange: { from: startDate, to: endDate },
    }));
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Danh sách câu trả lời</h1>
        <p className="text-base text-muted-foreground">
          Xem, lọc và quản lý danh sách các khảo sát đã được gửi về
        </p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button variant="outline" size="sm" className="h-9" onClick={() => setCleanupAction("RESURVEY")}>
          <Upload className="size-4" />
          Import
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-destructive hover:text-destructive"
          onClick={() => setCleanupAction("REMOVE")}
        >
          <Trash2 className="size-4" />
          Xóa
        </Button>
        <ExportSubmissionButton
          filter={{
            q: filter.store || undefined,
            region: filter.area || undefined,
            status: filter.status || undefined,
            startDate,
            endDate,
          }}
        />
      </div>
      {cleanupAction ? (
        <SurveyCleanupDialog
          action={cleanupAction}
          open
          onOpenChange={(open) => !open && setCleanupAction(null)}
          onCompleted={reloadSubmissions}
        />
      ) : null}
    </div>
  );
}

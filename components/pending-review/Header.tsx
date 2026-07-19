"use client";

import { useAppDispatch } from "@/hooks/redux";
import { exportSubmission } from "@/features/submission/submission.slice";
import { exportSubmissionToExcel } from "@/utils/export-submission-excel";
import { Button } from "../ui/button";

export function PendingReviewHeader() {
  const dispatch = useAppDispatch();

  const handleExport = async () => {
    try {
      await dispatch(exportSubmission({}))
        .unwrap()
        .then((res) => {
          const payload = res as any;
          const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
          const submissions = data?.submissions;
          if (!(Array.isArray(submissions) && submissions.length > 0)) {
            return;
          }
          const surveyData = data?.surveyData;
          const title = (surveyData?.title || "ket_qua_khao_sat").replace(/[\\/:*?"<>|]/g, "_");
          const dateStr = new Date().toISOString().slice(0, 10);
          exportSubmissionToExcel({
            survey: surveyData,
            submissions,
            filename: `${title}_${dateStr}.xlsx`,
          });
        });
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Danh sách câu trả lời</h1>
        <p className="text-base text-muted-foreground">
          Xem, lọc và quản lý danh sách các khảo sát đã được gửi về
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="bg-main text-white hover:bg-main/90 hover:text-white text-sm h-9"
        onClick={handleExport}
      >
        Xuất Excel
      </Button>
    </div>
  );
}

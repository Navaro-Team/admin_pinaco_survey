"use client";

import { useRef } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { useDialog } from "@/hooks/use-dialog";
import { exportSubmission } from "@/features/submission/submission.slice";
import { exportSubmissionToExcel } from "@/utils/export-submission-excel";
import { Button } from "../ui/button";

export function PendingReviewHeader() {
  const dispatch = useAppDispatch();
  const { showLoading, showFailed, hideDialog } = useDialog();
  const isExportingRef = useRef(false);

  const handleExport = async () => {
    if (isExportingRef.current) return;
    isExportingRef.current = true;
    showLoading({
      title: "Đang xử lý",
      description: "Đang xuất dữ liệu, vui lòng chờ trong giây lát...",
    });
    try {
      const res = await dispatch(exportSubmission({})).unwrap();
      const payload = res as any;
      const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
      const submissions = data?.submissions;
      if (!(Array.isArray(submissions) && submissions.length > 0)) {
        showFailed({
          title: "Thất bại",
          description: "Không có dữ liệu để xuất Excel.",
        });
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
      hideDialog();
    } catch (err) {
      console.error("Export error:", err);
      showFailed({
        title: "Thất bại",
        description: "Không thể xuất dữ liệu khảo sát.",
      });
    } finally {
      isExportingRef.current = false;
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

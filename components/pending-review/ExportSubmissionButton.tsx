"use client";

import { useAppDispatch } from "@/hooks/redux";
import { useExportExcel } from "@/hooks/use-export-excel";
import { exportSubmission } from "@/features/submission/submission.slice";
import { exportSubmissionToExcel } from "@/utils/export-submission-excel";
import { Button } from "../ui/button";

type Props = {
  filter?: {
    region?: string;
    staff?: string;
    businessType?: string;
    q?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
};

export function ExportSubmissionButton({ filter }: Props) {
  const dispatch = useAppDispatch();
  const runExport = useExportExcel();

  const handleExport = () =>
    runExport(async () => {
      const res = await dispatch(exportSubmission({
        region: filter?.region,
        staff: filter?.staff,
        business_type: filter?.businessType,
        q: filter?.q,
        status: filter?.status,
        startDate: filter?.startDate,
        endDate: filter?.endDate,
      })).unwrap();
      const payload = res as any;
      const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
      const submissions = data?.submissions;
      if (!(Array.isArray(submissions) && submissions.length > 0)) {
        return "Không có dữ liệu để xuất Excel.";
      }
      const surveyData = data?.surveyData;
      const title = (surveyData?.title || "ket_qua_khao_sat").replace(/[\\/:*?"<>|]/g, "_");
      const dateStr = new Date().toISOString().slice(0, 10);
      exportSubmissionToExcel({
        survey: surveyData,
        submissions,
        filename: `${title}_${dateStr}.xlsx`,
      });
    }, "Không thể xuất dữ liệu khảo sát.");

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-main text-white hover:bg-main/90 hover:text-white text-sm h-9"
      onClick={handleExport}
    >
      Xuất Excel
    </Button>
  );
}

"use client";

import { Button } from "../ui/button";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { exportTasks } from "@/features/task/task.slice";
import { useExportExcel } from "@/hooks/use-export-excel";
import { useToastContext } from "@/context/ToastContext";
import { exportSurveyToExcel, ExportSurveyExcelSheet } from "@/utils/export-survey-excel";
import { getTaskFilterParams } from "@/features/schedule/schedule.utils";

const toFileName = (name: string) => name.replace(/[\\/:*?"<>|]/g, "_");

/** Exports every task matching the schedule list filter (not just the current page), one sheet per survey. */
export function ExportExcelButton() {
  const dispatch = useAppDispatch();
  const { success } = useToastContext();
  const runExport = useExportExcel();
  const filter = useAppSelector((state) => state.schedule.filter);

  const handleExport = () =>
    runExport(async () => {
      const res = await dispatch(exportTasks(getTaskFilterParams(filter))).unwrap();
      const payload = res as any;
      const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
      const tasks: any[] = data?.tasks?.items ?? data?.tasks ?? [];
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return "Không có dữ liệu để xuất Excel.";
      }

      // Each task carries its survey with full surveyData; group tasks by survey
      const sheetMap = new Map<string, ExportSurveyExcelSheet>();
      for (const task of tasks) {
        const surveyId = String(task?.survey?.id ?? "");
        let sheet = sheetMap.get(surveyId);
        if (!sheet) {
          const surveyData = task?.survey?.surveyData;
          const title = surveyData?.title || task?.survey?.title || "Khảo sát";
          sheet = { survey: { surveyData: surveyData ?? {} }, tasks: [], sheetName: title };
          sheetMap.set(surveyId, sheet);
        }
        sheet.tasks.push(task);
      }
      const sheets = Array.from(sheetMap.values());

      const dateStr = format(new Date(), "yyyy-MM-dd");
      const filename = sheets.length === 1
        ? `${toFileName(sheets[0].sheetName ?? "khảo_sát")}_${dateStr}.xlsx`
        : `lich_trinh_khao_sat_${dateStr}.xlsx`;

      exportSurveyToExcel({
        sheets,
        filename,
        getPerformByInfo: (task) => {
          const p = task?.submission?.performedByInfo;
          if (p) {
            return [p.name, p.phone, p.email].filter(Boolean).join(" - ");
          }
          const a = task?.assignee;
          return [a?.name, a?.phone, a?.email].filter(Boolean).join(" - ");
        },
      });
      success(
        "Thành công",
        sheets.length > 1
          ? `Đã xuất ${tasks.length} lịch trình (${sheets.length} khảo sát, mỗi khảo sát một sheet) ra file Excel.`
          : `Đã xuất ${tasks.length} lịch trình ra file Excel.`
      );
    }, "Không thể xuất dữ liệu lịch trình.");

  return (
    <Button variant="outline" onClick={handleExport}>
      <CalendarRange className="size-4" />
      Xuất Excel
    </Button>
  );
}

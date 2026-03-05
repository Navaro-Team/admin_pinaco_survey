"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Combobox } from "../ui/combobox";
import { Label } from "../ui/label";
import { CalendarRange } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import DateRangeFilter from "../ui/DateRangeFilter";
import { exportTasks } from "@/features/task/task.slice";
import { useToastContext } from "@/context/ToastContext";
import { exportSurveyToExcel } from "@/utils/export-survey-excel";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export function ExportExcelPopover() {
  const dispatch = useAppDispatch();
  const { error, success } = useToastContext();
  const surveys = useAppSelector((state) => state.survey.surveys);
  const [open, setOpen] = useState(false);
  const [surveyId, setSurveyId] = useState<string>("");
  const [range, setRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const surveyOptions =
    surveys?.map((survey: any) => ({
      value: survey._id,
      label: survey?.surveyData?.title,
    })) ?? [];

  const handleExportClick = async () => {
    if (!surveyId || !range.from || !range.to) return;
    try {
      const startDate = range.from?.toISOString();
      const endDate = range.to?.toISOString();
      await dispatch(exportTasks({ surveyId, startDate, endDate }))
        .unwrap()
        .then((res) => {
          const payload = res as any;
          const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
          const survey = data?.survey;
          const tasks = data?.tasks?.items ?? data?.tasks;
          if (!(Array.isArray(tasks) && tasks.length > 0) || !survey) {
            error('Thất bại', 'Không có dữ liệu để xuất');
            return;
          }
          const surveyData = survey?.surveyData || survey;
          const title = (surveyData?.title || survey?.title || "khảo_sát").replace(/[\\/:*?"<>|]/g, "_");
          const dateStr = range.from && range.to
            ? `${range.from.toISOString().slice(0, 10)}_${range.to.toISOString().slice(0, 10)}`
            : new Date().toISOString().slice(0, 10);
          exportSurveyToExcel({
            survey: surveyData?.questions ? { surveyData } : survey,
            tasks,
            filename: `${title}_${dateStr}.xlsx`,
            getPerformByInfo: (task) => {
              const p = task?.submission?.performedByInfo;
              if (p) {
                return [p.name, p.phone, p.email].filter(Boolean).join(" - ");
              }
              const a = task?.assignee;
              return [a?.name, a?.phone, a?.email].filter(Boolean).join(" - ");
            },
          });
          success("Thành công", `Đã xuất ${tasks.length} lịch trình ra file Excel.`);
          setOpen(false);
        }).catch((err: any) => {
          throw err;
        });
    } catch (err) {
      console.log('error: ', err)
      error('Thất bại', 'Không thể xuất dữ liệu');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarRange className="mr-2 size-4" />
          Xuất Excel
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4" align="end">
        <div className="space-y-2">
          <Label>Khảo sát</Label>
          <Combobox
            className="w-full"
            options={surveyOptions}
            value={surveyId}
            placeholder="Chọn khảo sát"
            onChange={setSurveyId}
          />
        </div>

        <div className="space-y-2">
          <Label>Thời gian</Label>
          <DateRangeFilter
            className="w-full"
            dateRange={range}
            onDateChange={(range) => setRange({ from: range?.from, to: range?.to })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSurveyId("");
              setRange({ from: new Date(), to: new Date() });
            }}>
            Xóa
          </Button>
          <Button
            size="sm"
            className="bg-main text-white hover:bg-main/90 hover:text-white"
            disabled={!surveyId || !range.from || !range.to}
            onClick={handleExportClick}>
            Xuất
          </Button>
        </div>
      </PopoverContent>
    </Popover >
  );
}


"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Combobox } from "../ui/combobox";
import { Label } from "../ui/label";
import { CalendarRange } from "lucide-react";
import { endOfDay, format, startOfDay } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import DateRangeFilter from "../ui/DateRangeFilter";
import { exportTasks } from "@/features/task/task.slice";
import { useExportExcel } from "@/hooks/use-export-excel";
import { useToastContext } from "@/context/ToastContext";
import { exportSurveyToExcel } from "@/utils/export-survey-excel";
import { Status } from "../ui/status-badge";
import { getTaskFilterParams } from "@/features/schedule/schedule.utils";
import { campaignsService } from "@/features/campaigns/campaigns.service";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const STATUS_LABELS: Record<string, string> = {
  [Status.COMPLETED]: "Đã hoàn thành",
  [Status.IN_PROGRESS]: "Sắp diễn ra",
  [Status.OVERDUE]: "Quá hạn khảo sát",
  [Status.RESURVEY_REQUIRED]: "Yêu cầu hỗ trợ",
  [Status.CANCELLED]: "Đã huỷ",
};

export function ExportExcelPopover() {
  const dispatch = useAppDispatch();
  const { success } = useToastContext();
  const runExport = useExportExcel();
  const surveys = useAppSelector((state) => state.survey.surveys);
  const filter = useAppSelector((state) => state.schedule.filter);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const [open, setOpen] = useState(false);
  const [surveyId, setSurveyId] = useState<string>("");
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
  // Survey IDs of the campaign selected in the list filter; null = no campaign filter (show all surveys)
  const [campaignSurveyIds, setCampaignSurveyIds] = useState<string[] | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  const surveyOptions =
    surveys
      ?.filter((survey: any) => !campaignSurveyIds?.length || campaignSurveyIds.includes(survey._id))
      .map((survey: any) => ({
        value: survey._id,
        label: survey?.surveyData?.title,
      })) ?? [];

  const loadCampaignSurveys = async (campaignId: string) => {
    setLoadingCampaign(true);
    try {
      const payload = (await campaignsService.getCampaignById(campaignId)) as any;
      const campaign = payload?.data?.data?.data || payload?.data?.data || payload?.data;
      const ids: string[] = (campaign?.surveyFormIds ?? []).map(String);
      setCampaignSurveyIds(ids);
      // Keep the current choice if it belongs to the campaign, otherwise preselect when there is only one survey
      setSurveyId((current) => (ids.includes(current) ? current : ids.length === 1 ? ids[0] : ""));
    } catch {
      setCampaignSurveyIds(null);
    } finally {
      setLoadingCampaign(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      if (filter.campaignId) {
        loadCampaignSurveys(filter.campaignId);
      } else {
        setCampaignSurveyIds(null);
      }
    }
    setOpen(isOpen);
  };

  // Same filters as the schedule list, shown so the user knows what will be exported
  const activeFilters = [
    filter.q && { label: "Cửa hàng", value: filter.q },
    filter.areaOrProvince && { label: "Khu vực", value: filter.areaOrProvince },
    filter.assigneeId && {
      label: "Nhân viên",
      value: (() => {
        const staff = staffs.find((s) => s.id === filter.assigneeId);
        return staff ? [staff.code, staff.name].filter(Boolean).join(" - ") : "Đã chọn";
      })(),
    },
    filter.campaignId && {
      label: "Chiến dịch",
      value: campaigns.find((c) => c._id === filter.campaignId)?.campaignName ?? "Đã chọn",
    },
    filter.deadline && { label: "Hạn khảo sát", value: format(filter.deadline, "dd/MM/yyyy") },
    filter.status && { label: "Trạng thái", value: STATUS_LABELS[filter.status] ?? filter.status },
  ].filter(Boolean) as { label: string; value: string }[];

  const handleExportClick = () => {
    if (!surveyId) return;
    // A single click in the range picker only sets `from`; treat it as a one-day range
    const from = range.from;
    const to = range.to ?? range.from;
    const startDate = from ? startOfDay(from).toISOString() : undefined;
    const endDate = to ? endOfDay(to).toISOString() : undefined;
    const dateStr = from && to
      ? `${format(from, "yyyy-MM-dd")}_${format(to, "yyyy-MM-dd")}`
      : format(new Date(), "yyyy-MM-dd");
    return runExport(async () => {
      const res = await dispatch(exportTasks({ ...getTaskFilterParams(filter), surveyId, startDate, endDate })).unwrap();
      const payload = res as any;
      const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
      const survey = data?.survey;
      const tasks = data?.tasks?.items ?? data?.tasks;
      if (!(Array.isArray(tasks) && tasks.length > 0) || !survey) {
        return "Không có dữ liệu để xuất Excel.";
      }
      const surveyData = survey?.surveyData || survey;
      const title = (surveyData?.title || survey?.title || "khảo_sát").replace(/[\\/:*?"<>|]/g, "_");
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
    }, "Không thể xuất dữ liệu lịch trình.");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarRange className="size-4" />
          Xuất Excel
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4" align="end">
        <div className="space-y-2">
          <Label>Khảo sát</Label>
          <Combobox
            className="w-full"
            disabled={loadingCampaign}
            options={surveyOptions}
            value={surveyId}
            placeholder={loadingCampaign ? "Đang tải khảo sát của chiến dịch..." : "Chọn khảo sát"}
            onChange={setSurveyId}
          />
          {!!campaignSurveyIds?.length && (
            <p className="text-xs text-muted-foreground">Chỉ hiển thị khảo sát thuộc chiến dịch đang lọc</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Thời gian (không bắt buộc)</Label>
          <DateRangeFilter
            className="w-full h-10!"
            dateRange={range}
            onDateChange={(range) => setRange({ from: range?.from, to: range?.to })}
          />
        </div>

        <div className="space-y-1 rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Theo bộ lọc của danh sách</p>
          {activeFilters.length > 0 ? (
            activeFilters.map((item) => (
              <p key={item.label} className="text-muted-foreground">
                {item.label}: <span className="text-foreground">{item.value}</span>
              </p>
            ))
          ) : (
            <p className="text-muted-foreground">Không có bộ lọc, xuất toàn bộ lịch trình của khảo sát</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSurveyId("");
              setRange({ from: undefined, to: undefined });
            }}>
            Xóa
          </Button>
          <Button
            size="sm"
            className="bg-main text-white hover:bg-main/90 hover:text-white"
            disabled={!surveyId}
            onClick={handleExportClick}>
            Xuất
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

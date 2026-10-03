"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { InputCalendar } from "../ui/InputCalendar";
import { ProgressBar } from "../ui/progress-bar";
import { Combobox } from "../ui/combobox";
import { campaignsService } from "@/features/campaigns/campaigns.service";
import { type Campaign, parseCampaigns } from "@/model/Campaign.model";
import { cn } from "@/lib/utils";
import { useDialog } from "@/hooks/use-dialog";
import { surveyCleanupService } from "@/features/survey-cleanup/survey-cleanup.service";
import {
  PREVIEW_STATUS_LABEL,
  type CleanupAction,
  type CleanupItem,
  type CleanupPreview,
} from "@/features/survey-cleanup/survey-cleanup.types";
import { namedSheetLabel, parseCleanupExcel } from "@/utils/parse-cleanup-excel";

type Props = {
  action: CleanupAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted?: () => void;
};

const KEEP_CAMPAIGN = "__keep__";

/** Stores per request — keeps each call well under the DB / HTTP timeouts. */
const BATCH_SIZE = 50;

type BatchTotals = { stores: number; submissions: number; tasks: number; skipped: number };
const EMPTY_TOTALS: BatchTotals = { stores: 0, submissions: 0, tasks: 0, skipped: 0 };

const TEXT: Record<CleanupAction, { title: string; description: string; confirm: string }> = {
  REMOVE: {
    title: "Xóa điểm bán bỏ khảo sát",
    description: "Điểm bán, task và câu trả lời của các điểm trong danh sách sẽ bị xóa khỏi hệ thống và dashboard.",
    confirm: "Xác nhận xóa",
  },
  RESURVEY: {
    title: "Import danh sách khảo sát lại",
    description:
      "Câu trả lời cũ bị ẩn khỏi dashboard (vẫn giữ để tra cứu). Task được mở lại và giao cho nhân viên chỉ định — " +
      "nếu chọn chiến dịch, task được tạo trong chiến dịch đó và task ở chiến dịch cũ bị hủy.",
    confirm: "Xác nhận khảo sát lại",
  },
};

export function SurveyCleanupDialog({ action, open, onOpenChange, onCompleted }: Props) {
  const { showSuccess } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopRef = useRef(false);
  const [fileName, setFileName] = useState<string>("");
  const [preview, setPreview] = useState<CleanupPreview | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [loading, setLoading] = useState<"preview" | "submit" | null>(null);
  const [error, setError] = useState<string>("");
  // Batched execution: rows still to send, and running totals of processed batches
  const [remaining, setRemaining] = useState<CleanupItem[] | null>(null);
  const [totals, setTotals] = useState<BatchTotals>(EMPTY_TOTALS);
  // RESURVEY only: rows read from the file (kept to re-run preview) and the optional target campaign
  const [parsedItems, setParsedItems] = useState<CleanupItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState<string>("");

  const text = TEXT[action];
  const issues = preview ? preview.total - preview.valid : 0;
  const rows = useMemo(
    () => (preview?.items ?? []).filter((i) => !onlyIssues || i.status !== "OK"),
    [preview, onlyIssues]
  );

  const validItems = useMemo<CleanupItem[]>(
    () =>
      (preview?.items ?? [])
        .filter((i) => i.status === "OK")
        .map((i) => ({ storeCode: i.storeCode, ...(i.employeeCode && { employeeCode: i.employeeCode }) })),
    [preview]
  );
  const processedCount = validItems.length - (remaining?.length ?? validItems.length);
  const isResuming = remaining !== null && remaining.length > 0 && processedCount > 0;

  // Warn before reload / tab close while batches are being sent
  useEffect(() => {
    if (loading !== "submit") return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [loading]);

  // Campaigns for the resurvey target picker
  useEffect(() => {
    if (action !== "RESURVEY") return;
    campaignsService
      .getCampaigns({ page: 1, limit: 100 })
      .then((res) => {
        const payload = res as any;
        const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        setCampaigns(parseCampaigns(data?.campaigns || []).filter((c) => !c.isDeleted && c.status !== "ARCHIVED"));
      })
      .catch(() => setCampaigns([]));
  }, [action]);

  const reset = () => {
    setFileName("");
    setParsedItems([]);
    setPreview(null);
    setDueDate(null);
    setOnlyIssues(false);
    setError("");
    setRemaining(null);
    setTotals(EMPTY_TOTALS);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (next: boolean) => {
    if (loading) return;
    if (!next) {
      reset();
      setCampaignId("");
    }
    onOpenChange(next);
  };

  const runPreview = async (items: CleanupItem[], targetCampaignId: string) => {
    setLoading("preview");
    setError("");
    try {
      setPreview(await surveyCleanupService.preview(action, items, targetCampaignId || undefined));
    } catch (err: any) {
      setPreview(null);
      setError(err?.message || "Không thể kiểm tra danh sách.");
    } finally {
      setLoading(null);
    }
  };

  const handleFile = async (file: File) => {
    reset();
    setFileName(file.name);
    let parsed: CleanupItem[];
    try {
      parsed = await parseCleanupExcel(file, action);
      if (parsed.length === 0) throw new Error(`Sheet "${namedSheetLabel(action)}" không có điểm bán nào.`);
    } catch (err: any) {
      setError(err?.message || "Không thể đọc file.");
      return;
    }
    setParsedItems(parsed);
    await runPreview(parsed, campaignId);
  };

  // A target campaign changes which rows are valid (stores without a task get a new one), so re-check
  const handleCampaignChange = (value: string) => {
    const next = value === KEEP_CAMPAIGN ? "" : value;
    setCampaignId(next);
    const campaign = campaigns.find((c) => c._id === next);
    if (campaign?.endDate && !dueDate) setDueDate(new Date(campaign.endDate));
    if (parsedItems.length > 0) runPreview(parsedItems, next);
  };

  const handleConfirm = async () => {
    if (!preview || preview.valid === 0) return;
    if (action === "RESURVEY" && !dueDate) {
      setError("Vui lòng chọn hạn hoàn thành khảo sát lại.");
      return;
    }
    setLoading("submit");
    setError("");
    stopRef.current = false;

    // Send only rows that passed preview, in small sequential batches so each request stays short
    let queue = remaining && remaining.length > 0 ? remaining : validItems;
    let acc = remaining && remaining.length > 0 ? totals : EMPTY_TOTALS;
    setRemaining(queue);

    while (queue.length > 0) {
      if (stopRef.current) break;
      const batch = queue.slice(0, BATCH_SIZE);
      try {
        if (action === "REMOVE") {
          const res = await surveyCleanupService.remove(batch);
          acc = {
            stores: acc.stores + res.removedStores,
            submissions: acc.submissions + res.deletedSubmissions,
            tasks: acc.tasks + res.deletedTasks,
            skipped: acc.skipped + res.skipped,
          };
        } else {
          const res = await surveyCleanupService.resurvey(
            batch,
            format(dueDate!, "yyyy-MM-dd"),
            campaignId || undefined
          );
          acc = {
            stores: acc.stores + res.processedStores,
            submissions: acc.submissions + res.cancelledSubmissions,
            tasks: acc.tasks + res.reopenedTasks + (res.createdTasks ?? 0),
            skipped: acc.skipped + res.skipped,
          };
        }
      } catch (err: any) {
        setLoading(null);
        setError(
          `Lỗi khi xử lý lô ${batch[0].storeCode}…: ${err?.message || "không xác định"}. ` +
          `Nhấn "Chạy tiếp" để xử lý ${queue.length} điểm còn lại.`
        );
        onCompleted?.();
        return;
      }
      queue = queue.slice(batch.length);
      setTotals(acc);
      setRemaining(queue);
    }

    setLoading(null);
    onCompleted?.();
    if (queue.length > 0) {
      setError(`Đã dừng. Còn ${queue.length} điểm chưa xử lý, nhấn "Chạy tiếp" để tiếp tục.`);
      return;
    }
    handleOpenChange(false);
    showSuccess({
      title: "Thành công",
      description:
        action === "REMOVE"
          ? `Đã xóa ${acc.stores} điểm bán, ${acc.submissions} câu trả lời, ${acc.tasks} task.`
          : `Đã mở lại ${acc.stores} điểm bán (${acc.tasks} task), ẩn ${acc.submissions} câu trả lời cũ.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-5xl max-h-[90vh] flex flex-col"
        showCloseButton={!loading}
        onEscapeKeyDown={(e) => loading && e.preventDefault()}
        onInteractOutside={(e) => loading && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 min-h-0 flex-1">
          <div className="flex flex-row items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!loading || processedCount > 0}
            >
              <Upload className="size-4" />
              Chọn file tổng kết
            </Button>
            {fileName ? (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <FileSpreadsheet className="size-4" />
                {fileName} · sheet &quot;{namedSheetLabel(action)}&quot;
              </span>
            ) : null}
            {loading === "preview" ? <Loader2 className="size-4 animate-spin" /> : null}
          </div>

          {remaining !== null ? (
            <ProgressBar
              label={loading === "submit" ? "Đang xử lý..." : "Tiến độ"}
              subLabel={`${processedCount.toLocaleString("vi-VN")} / ${validItems.length.toLocaleString("vi-VN")} điểm · ${totals.submissions.toLocaleString("vi-VN")} câu trả lời · ${totals.tasks.toLocaleString("vi-VN")} task`}
              current={processedCount}
              total={validItems.length}
            />
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {preview ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Stat label="Số dòng trong file" value={preview.total} />
                <Stat label="Hợp lệ, sẽ xử lý" value={preview.valid} tone="ok" />
                <Stat label="Bỏ qua" value={issues} tone={issues > 0 ? "warn" : undefined} />
                <Stat
                  label={action === "REMOVE" ? "Câu trả lời bị xóa" : "Câu trả lời bị ẩn"}
                  value={preview.activeSubmissions}
                />
              </div>

              <div className="flex flex-row flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} />
                  Chỉ hiển thị dòng bị bỏ qua
                </label>
                {action === "RESURVEY" ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="whitespace-nowrap">Chiến dịch</span>
                    <Combobox
                      className="w-64"
                      options={[
                        { value: KEEP_CAMPAIGN, label: "Giữ chiến dịch hiện tại" },
                        ...campaigns.map((c) => ({ value: c._id, label: c.campaignName })),
                      ]}
                      value={campaignId || KEEP_CAMPAIGN}
                      onChange={handleCampaignChange}
                      placeholder="Chọn chiến dịch"
                      disabled={!!loading || processedCount > 0}
                    />
                    <span className="whitespace-nowrap">Hạn hoàn thành</span>
                    <div className="w-44">
                      <InputCalendar
                        value={dueDate}
                        onChange={setDueDate}
                        placeholder="dd/MM/yyyy"
                        disabled={!!loading || processedCount > 0}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border rounded-md overflow-auto min-h-0 flex-1 max-h-[45vh]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>Mã điểm bán</TableHead>
                      <TableHead>Tên điểm bán</TableHead>
                      <TableHead>Khu vực</TableHead>
                      <TableHead className="text-right">Câu trả lời</TableHead>
                      <TableHead>Người khảo sát hiện tại</TableHead>
                      {action === "RESURVEY" ? <TableHead>Người khảo sát lại</TableHead> : null}
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((item, idx) => (
                      <TableRow key={`${item.storeCode}-${idx}`}>
                        <TableCell className="font-mono">{item.storeCode}</TableCell>
                        <TableCell>{item.storeName ?? "-"}</TableCell>
                        <TableCell>{item.area ?? "-"}</TableCell>
                        <TableCell className="text-right">{item.activeSubmissions}</TableCell>
                        <TableCell>{item.currentAssignee ?? "-"}</TableCell>
                        {action === "RESURVEY" ? (
                          <TableCell>
                            {item.employeeName ?? "-"}
                            <span className="text-muted-foreground"> ({item.employeeCode || "trống"})</span>
                          </TableCell>
                        ) : null}
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs whitespace-nowrap",
                              item.status === "OK" ? "text-green-600" : "text-amber-600"
                            )}
                          >
                            {item.status === "OK" ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
                            {PREVIEW_STATUS_LABEL[item.status]}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter>
          {loading === "submit" ? (
            <Button variant="outline" onClick={() => { stopRef.current = true; }}>
              Dừng sau lô hiện tại
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={!!loading}>
              {processedCount > 0 ? "Đóng" : "Hủy"}
            </Button>
          )}
          <Button
            variant={action === "REMOVE" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={
              !preview || validItems.length === 0 || !!loading || (action === "RESURVEY" && !dueDate) ||
              (remaining !== null && remaining.length === 0)
            }
          >
            {loading === "submit" ? <Loader2 className="size-4 animate-spin" /> : null}
            {isResuming
              ? `Chạy tiếp (${remaining!.length})`
              : `${text.confirm} ${preview ? `(${validItems.length})` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "ok" | "warn" }) {
  return (
    <div className="border rounded-md px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-lg font-semibold",
          tone === "ok" && "text-green-600",
          tone === "warn" && "text-amber-600"
        )}
      >
        {value.toLocaleString("vi-VN")}
      </div>
    </div>
  );
}

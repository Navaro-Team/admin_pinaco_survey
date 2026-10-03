"use client";

import { useMemo, useRef, useState } from "react";
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

const TEXT: Record<CleanupAction, { title: string; description: string; confirm: string }> = {
  REMOVE: {
    title: "Xóa điểm bán bỏ khảo sát",
    description: "Điểm bán, task và câu trả lời của các điểm trong danh sách sẽ bị xóa khỏi hệ thống và dashboard.",
    confirm: "Xác nhận xóa",
  },
  RESURVEY: {
    title: "Import danh sách khảo sát lại",
    description: "Câu trả lời cũ bị ẩn khỏi dashboard (vẫn giữ để tra cứu), task được mở lại và giao cho nhân viên chỉ định.",
    confirm: "Xác nhận khảo sát lại",
  },
};

export function SurveyCleanupDialog({ action, open, onOpenChange, onCompleted }: Props) {
  const { showSuccess, showFailed } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [items, setItems] = useState<CleanupItem[]>([]);
  const [preview, setPreview] = useState<CleanupPreview | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [loading, setLoading] = useState<"preview" | "submit" | null>(null);
  const [error, setError] = useState<string>("");

  const text = TEXT[action];
  const issues = preview ? preview.total - preview.valid : 0;
  const rows = useMemo(
    () => (preview?.items ?? []).filter((i) => !onlyIssues || i.status !== "OK"),
    [preview, onlyIssues]
  );

  const reset = () => {
    setFileName("");
    setItems([]);
    setPreview(null);
    setDueDate(null);
    setOnlyIssues(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (next: boolean) => {
    if (loading) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const handleFile = async (file: File) => {
    reset();
    setFileName(file.name);
    setLoading("preview");
    try {
      const parsed = await parseCleanupExcel(file, action);
      if (parsed.length === 0) throw new Error(`Sheet "${namedSheetLabel(action)}" không có điểm bán nào.`);
      setItems(parsed);
      setPreview(await surveyCleanupService.preview(action, parsed));
    } catch (err: any) {
      setError(err?.message || "Không thể đọc file.");
    } finally {
      setLoading(null);
    }
  };

  const handleConfirm = async () => {
    if (!preview || preview.valid === 0) return;
    if (action === "RESURVEY" && !dueDate) {
      setError("Vui lòng chọn hạn hoàn thành khảo sát lại.");
      return;
    }
    setLoading("submit");
    setError("");
    try {
      let description: string;
      if (action === "REMOVE") {
        const res = await surveyCleanupService.remove(items);
        description = `Đã xóa ${res.removedStores} điểm bán, ${res.deletedSubmissions} câu trả lời, ${res.deletedTasks} task. Bỏ qua ${res.skipped} dòng.`;
      } else {
        const res = await surveyCleanupService.resurvey(items, format(dueDate!, "yyyy-MM-dd"));
        description = `Đã mở lại ${res.processedStores} điểm bán (${res.reopenedTasks} task), ẩn ${res.cancelledSubmissions} câu trả lời cũ. Bỏ qua ${res.skipped} dòng.`;
      }
      setLoading(null);
      handleOpenChange(false);
      showSuccess({ title: "Thành công", description });
      onCompleted?.();
    } catch (err: any) {
      setLoading(null);
      showFailed({ title: "Thất bại", description: err?.message || "Không thể xử lý danh sách." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col">
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
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={!!loading}>
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

              <div className="flex flex-row items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} />
                  Chỉ hiển thị dòng bị bỏ qua
                </label>
                {action === "RESURVEY" ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="whitespace-nowrap">Hạn hoàn thành</span>
                    <div className="w-44">
                      <InputCalendar value={dueDate} onChange={setDueDate} placeholder="dd/MM/yyyy" />
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
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={!!loading}>
            Hủy
          </Button>
          <Button
            variant={action === "REMOVE" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={!preview || preview.valid === 0 || !!loading || (action === "RESURVEY" && !dueDate)}
          >
            {loading === "submit" ? <Loader2 className="size-4 animate-spin" /> : null}
            {text.confirm} {preview ? `(${preview.valid})` : ""}
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

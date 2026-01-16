"use client";

import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearStaffsState, getUsers, importUsers } from "@/features/staffs/staffs.slice";

interface ImportLog {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
  timestamp: Date;
}

interface StaffSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffSheet({
  open,
  onOpenChange,
}: StaffSheetProps) {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const staffsState = useAppSelector((state) => state.staffs.requestState);
  const isImporting = staffsState.status === 'loading' && staffsState.type === 'importUsers';

  const acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
  ];

  const acceptedExtensions = [".xlsx", ".xls", ".csv"];

  const validateFile = (file: File): boolean => {
    const isValidType = acceptedTypes.includes(file.type) ||
      acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      addLog({
        message: `File không hợp lệ. Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV (.csv)`,
        type: "error",
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      addLog({
        message: `File quá lớn. Kích thước tối đa là 10MB`,
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setLogs([])
      setSelectedFile(file);
      addLog({
        message: `Đã chọn file: ${file.name}`,
        type: "success",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLogs([])
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setLogs([])
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addLog = (log: Omit<ImportLog, "id" | "timestamp">) => {
    const newLog: ImportLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...log,
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const getLogIcon = (type: ImportLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="size-4 text-green-500" />;
      case "error":
        return <XCircle className="size-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="size-4 text-yellow-500" />;
    }
  };

  const getLogTextColor = (type: ImportLog["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      addLog({
        message: "Vui lòng chọn file để import",
        type: "warning",
      });
      return;
    }

    addLog({
      message: `Đang import file: ${selectedFile.name}...`,
      type: "success",
    });

    try {
      const res = await dispatch(importUsers(selectedFile)).unwrap();
      const payload = res as any;
      const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;

      if (responseData) {
        const { imported = 0, updated = 0, errors = [], totalErrors = 0 } = responseData;

        if (imported > 0 || updated > 0) {
          const summaryMessages: string[] = [];
          if (imported > 0) {
            summaryMessages.push(`${imported} bản ghi đã được import`);
          }
          if (updated > 0) {
            summaryMessages.push(`${updated} bản ghi đã được cập nhật`);
          }
          addLog({
            message: summaryMessages.join(", "),
            type: "success",
          });
        }

        if (totalErrors > 0) {
          addLog({
            message: `Có ${totalErrors} lỗi trong quá trình import`,
            type: "warning",
          });
        }

        if (errors && errors.length > 0) {
          errors.forEach((error: any) => {
            const { row, errors: errorMessages, raw } = error;
            const name = raw?.["Họ và tên"] || raw?.["__EMPTY"] || `Dòng ${row}`;

            errorMessages.forEach((errorMsg: string) => {
              addLog({
                message: `Dòng ${row} - ${name}: ${errorMsg}`,
                type: "error",
              });
            });
          });
        }

        if (totalErrors === 0) {
          addLog({
            message: `Import hoàn tất thành công!`,
            type: "success",
          });
        } else {
          addLog({
            message: `Import hoàn tất với ${totalErrors} lỗi`,
            type: "warning",
          });
        }
      }
    } catch (err: any) {
      addLog({
        message: `Lỗi import: ${err?.message || "Có lỗi xảy ra khi import file"}`,
        type: "error",
      });
    } finally {
      dispatch(getUsers());
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col gap-2">
        <SheetHeader className="pb-0!">
          <SheetTitle>Import nhân sự</SheetTitle>
          <SheetDescription hidden>Thông tin chi tiết về nhân sự</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 flex flex-col gap-4 px-3 overflow-hidden min-h-0">
          {/* File Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Chọn file import</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors",
                "hover:border-primary hover:bg-accent/50",
                isDragging && "border-primary bg-accent",
                selectedFile && "border-primary/50 bg-accent/30"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <FileSpreadsheet className="size-10 text-primary" />
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="h-6 w-6"
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="size-10 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium">
                      Nhấn để chọn file hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Hỗ trợ file Excel (.xlsx, .xls) hoặc CSV (.csv)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Import Logs */}
          <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
            <label className="text-sm font-medium">Nhật ký import</label>
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-muted/30 min-h-0">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  Chưa có log nào
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-row items-start gap-2 p-2 rounded-md bg-background"
                    >
                      {getLogIcon(log.type)}
                      <div className="flex-1 flex flex-col gap-1">
                        <span className={cn("text-sm", getLogTextColor(log.type))}>
                          {log.message}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Separator />

        <SheetFooter className="flex-row justify-end gap-2 pt-2!">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setLogs([]);
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              dispatch(clearStaffsState());
            }}>
            Đóng
          </Button>
          <Button
            type="button"
            variant="default"
            className="bg-main hover:bg-main/90"
            onClick={handleImport}
            disabled={!selectedFile || isImporting}>
            {isImporting ? "Đang import..." : "Import"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
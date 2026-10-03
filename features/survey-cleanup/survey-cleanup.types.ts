export type CleanupAction = "REMOVE" | "RESURVEY";

export type PreviewItemStatus = "OK" | "STORE_NOT_FOUND" | "EMPLOYEE_NOT_FOUND" | "NO_TASK" | "DUPLICATE";

export interface CleanupItem {
  storeCode: string;
  employeeCode?: string;
}

export interface PreviewItem {
  storeCode: string;
  storeName?: string;
  area?: string;
  province?: string;
  activeSubmissions: number;
  tasks: number;
  currentAssignee?: string;
  employeeCode?: string;
  employeeName?: string;
  status: PreviewItemStatus;
}

export interface CleanupPreview {
  action: CleanupAction;
  total: number;
  valid: number;
  activeSubmissions: number;
  items: PreviewItem[];
}

export interface RemoveResult {
  requested: number;
  skipped: number;
  removedStores: number;
  deletedSubmissions: number;
  deletedTasks: number;
}

export interface ResurveyResult {
  requested: number;
  skipped: number;
  processedStores: number;
  cancelledSubmissions: number;
  reopenedTasks: number;
  dueDate: string;
}

export const PREVIEW_STATUS_LABEL: Record<PreviewItemStatus, string> = {
  OK: "Hợp lệ",
  STORE_NOT_FOUND: "Không tìm thấy điểm bán",
  EMPLOYEE_NOT_FOUND: "Không tìm thấy nhân viên",
  NO_TASK: "Điểm bán chưa có task",
  DUPLICATE: "Trùng mã trong file",
};

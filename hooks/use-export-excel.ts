"use client";

import { useCallback, useRef } from "react";
import { useDialog } from "@/hooks/use-dialog";

/**
 * Runs an Excel export behind a blocking "Đang xử lý" dialog so the user cannot trigger it repeatedly.
 * `task` may return a string to report a failure (e.g. no data); a thrown error shows `errorDescription`.
 */
export function useExportExcel() {
  const { showLoading, showFailed, hideDialog } = useDialog();
  const busyRef = useRef(false);

  return useCallback(
    async (task: () => Promise<string | void>, errorDescription = "Không thể xuất dữ liệu.") => {
      if (busyRef.current) return;
      busyRef.current = true;
      showLoading({
        title: "Đang xử lý",
        description: "Đang xuất dữ liệu, vui lòng chờ trong giây lát...",
      });
      try {
        const failure = await task();
        if (failure) {
          showFailed({ title: "Thất bại", description: failure });
        } else {
          hideDialog();
        }
      } catch (err) {
        console.error("Export error:", err);
        showFailed({ title: "Thất bại", description: errorDescription });
      } finally {
        busyRef.current = false;
      }
    },
    [showLoading, showFailed, hideDialog]
  );
}

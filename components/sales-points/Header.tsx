"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { SalesPointSheet } from "./SalesPointSheet";
import { Spinner } from "../ui/spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { exportSalesPoints } from "@/features/sales-points/sales-points.slice";
import { parseStores } from "@/model/Store.model";
import { useDialog } from "@/hooks/use-dialog";
import { exportStoresToExcel } from "@/utils/export-stores-excel";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { showFailed } = useDialog();
  const dispatch = useAppDispatch();
  const requestState = useAppSelector((state) => state.salesPoints.requestState);
  const isExporting = requestState.status === 'loading' && requestState.type === 'exportSalesPoints';

  const handleExportExcel = async () => {
    try {
      await dispatch(exportSalesPoints({ page: 1, limit: 10000 }))
        .unwrap()
        .then((res) => {
          const payload = res as any;
          const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
          const stores = parseStores(Array.isArray(data) ? data : data?.data);
          if (stores.length === 0) {
            showFailed({
              title: "Thất bại",
              description: "Không có dữ liệu điểm bán để xuất Excel.",
            });
            return;
          }

          exportStoresToExcel(stores);
        }).catch((e: any) => {
          throw e;
        })
    } catch (e) {
      showFailed({
        title: "Thất bại",
        description: "Không thể xuất dữ liệu điểm bán.",
      });
    }
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Danh sách điểm bán</h1>
          <p className="text-base text-muted-foreground">Quản lý và chỉnh sửa thông tin điểm bán</p>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Link href="/sales-points/new">
            <Button className="bg-main text-white hover:bg-main/90">
              <Plus className="size-4" />
              Tạo
            </Button>
          </Link>
          <Button variant="outline" onClick={handleExportExcel} disabled={isExporting}>
            <Download className="size-4" />
            {isExporting ? <Spinner className="size-4 animate-spin" /> : 'Xuất Excel'}
          </Button>
          <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
            <Upload className="size-4" />
            Import
          </Button>
        </div>
      </div>
      <SalesPointSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  )
}


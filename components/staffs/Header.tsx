import { Button } from "../ui/button";
import { Download, Import, Plus } from "lucide-react";
import Link from "next/link";
import { StaffSheet } from "./StaffSheet";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useDialog } from "@/hooks/use-dialog";
import { exportUsers } from "@/features/staffs/staffs.slice";
import { parseUsers } from "@/model/User.model";
import { exportStaffsToExcel } from "@/utils/export-staffs-excel";
import { Spinner } from "../ui/spinner";

export function Header() {
  const [openStaffSheet, setOpenStaffSheet] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { showFailed } = useDialog();
  const requestState = useAppSelector((state) => state.staffs.requestState);
  const isExporting = requestState.status === 'loading' && requestState.type === 'exportUsers';

  const handleExportExcel = async () => {
    try {
      await dispatch(exportUsers({ page: 1, limit: 10000 })).unwrap().then((res) => {
        const payload = res as any;
        const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        const staffs = parseUsers(data);
        if (staffs.length === 0) {
          showFailed({
            title: "Thất bại",
            description: "Không có dữ liệu nhân sự để xuất Excel.",
          });
          return;
        }

        exportStaffsToExcel(staffs);
      }).catch((e: any) => {
        throw e;
      })
    } catch (e) {
      showFailed({
        title: "Thất bại",
        description: "Không thể xuất dữ liệu nhân sự.",
      });
    }
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Danh sách nhân sự</h1>
        <p className="text-base text-muted-foreground">Quản lý và chỉnh sửa thông tin nhân sự</p>
      </div>
      <div className="flex flex-row gap-2">
        <Link href="/staffs/new">
          <Button className="bg-main text-white hover:bg-main/90">
            <Plus className="size-4" />
            Thêm nhân sự
          </Button>
        </Link>
        <Button variant="outline" onClick={handleExportExcel} disabled={isExporting}>
          <Download className="size-4" />
          {isExporting ? <Spinner className="size-4 animate-spin" /> : 'Xuất Excel'}
        </Button>
        <Button variant="outline" onClick={() => setOpenStaffSheet(true)}>
          <Import className="size-4" />
          Import
        </Button>
      </div>
      <StaffSheet open={openStaffSheet} onOpenChange={setOpenStaffSheet} />
    </div>
  );
}

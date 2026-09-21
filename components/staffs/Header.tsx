import { Button } from "../ui/button";
import { Download, Import, Plus } from "lucide-react";
import Link from "next/link";
import { StaffSheet } from "./StaffSheet";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { useDialog } from "@/hooks/use-dialog";
import { useExportExcel } from "@/hooks/use-export-excel";
import { exportUsers } from "@/features/staffs/staffs.slice";
import { parseUsers } from "@/model/User.model";
import { exportStaffsToExcel } from "@/utils/export-staffs-excel";

export function Header() {
  const [openStaffSheet, setOpenStaffSheet] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { showFailed } = useDialog();
  const runExport = useExportExcel();

  const handleExportExcel = () =>
    runExport(async () => {
      const res = await dispatch(exportUsers()).unwrap();
      const payload = res as any;
      const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
      const staffs = parseUsers(data);
      if (staffs.length === 0) {
        return "Không có dữ liệu nhân sự để xuất Excel.";
      }

      exportStaffsToExcel(staffs);
    }, "Không thể xuất dữ liệu nhân sự.");

  const handleDownloadTemplate = async () => {
    try {
      const link = document.createElement("a");
      link.href = "/excel/template_employee.xlsx";
      link.download = "template_employee.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      showFailed({
        title: "Thất bại",
        description: "Không thể tải file template.",
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
        <Button variant="outline" onClick={handleExportExcel}>
          <Download className="size-4" />
          Xuất Excel
        </Button>
        <Button variant="outline" onClick={handleDownloadTemplate}>
          <Download className="size-4" />
          Template
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

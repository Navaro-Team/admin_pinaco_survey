import { IconFileExport, IconFileImport } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Download, Upload } from "lucide-react";

export function Header() {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Quản lý lịch trình khảo sát</h1>
        <p className="text-base text-muted-foreground">Xem, lọc và quản lý danh sách các lịch trình khảo sát tại điểm bán</p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Button variant="outline">
          <Upload className="size-4" />
          Import Excel
        </Button>
        <Button variant="outline">
          <Download className="size-4" />
          Export Excel
        </Button>
      </div>
    </div>
  )
}
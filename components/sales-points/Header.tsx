import { Button } from "../ui/button";
import { Plus, Upload, Download } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
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


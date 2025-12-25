import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Danh sách nhân sự</h1>
        <p className="text-base text-muted-foreground">Quản lý và chỉnh sửa thông tin nhân sự</p>
      </div>
      <Link href="/staffs/new">
        <Button className="bg-main text-white hover:bg-main/90">
          <Plus className="size-4" />
          Thêm nhân sự
        </Button>
      </Link>
    </div>
  )
}


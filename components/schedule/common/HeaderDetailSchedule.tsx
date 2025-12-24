import { Button } from "@/components/ui/button";
import { Download, PencilIcon } from "lucide-react";

export function HeaderDetailSchedule() {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Chi tiết lịch trình</h1>
        <p className="text-base text-muted-foreground">Xem lại thông tin chi tiết và kết quả khảo sát tại điểm bán</p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Button variant="outline">
          <PencilIcon className="size-4" />
          Chỉnh sửa
        </Button>
        <Button variant="outline">
          <Download className="size-4" />
          Xuất PDF
        </Button>
      </div>
    </div>
  )
}
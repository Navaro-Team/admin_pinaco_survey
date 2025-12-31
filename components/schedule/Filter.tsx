import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { InputCalendar } from "../ui/InputCalendar";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { changeArea, changeDeadline, changeRegion, changeStatus, changeStore, clearFilter, getTasks, resetPagination } from "@/features/schedule/schedule.slice";
import { Status } from "../ui/status-badge";
import { Button } from "../ui/button";
import { RefreshCcw, X } from "lucide-react";

export function Filter() {
  const dispatch = useAppDispatch();

  const store = useAppSelector((state) => state.schedule.filter.store);
  const area = useAppSelector((state) => state.schedule.filter.area);
  const region = useAppSelector((state) => state.schedule.filter.region);
  const status = useAppSelector((state) => state.schedule.filter.status);
  const deadline = useAppSelector((state) => state.schedule.filter.deadline);

  const handleClearFilter = () => {
    dispatch(clearFilter());
  }

  const handleRefresh = () => {
    handleClearFilter();
    dispatch(resetPagination());
    dispatch(getTasks({ page: 1, limit: 20 }));
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tên cửa hàng</Label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={store}
              onChange={(e) => dispatch(changeStore(e.target.value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Combobox
              className="w-full"
              options={[
                { value: "1", label: "Khu vực 1" },
                { value: "2", label: "Khu vực 2" },
                { value: "3", label: "Khu vực 3" }]}
              value={area}
              placeholder="Chọn khu vực"
              onChange={(value) => dispatch(changeArea(value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Vùng</Label>
            <Combobox
              options={[
                { value: "1", label: "Vùng 1" },
                { value: "2", label: "Vùng 2" },
                { value: "3", label: "Vùng 3" }]}
              value={region}
              className="w-full"
              placeholder="Chọn vùng"
              onChange={(value) => dispatch(changeRegion(value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Hạn khảo sát</Label>
            <InputCalendar
              placeholder="Chọn hạn khảo sát"
              inputFormat="dd/MM/yyyy"

              value={deadline}
              onChange={(value) => dispatch(changeDeadline(value))}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Trạng thái</Label>
            <Combobox
              className="w-full"
              options={[
                { value: Status.COMPLETED, label: "Đã hoàn thành" },
                { value: Status.IN_PROGRESS, label: "Sắp diễn ra" },
                { value: Status.OVERDUE, label: "Quá hạn khảo sát" },
                { value: Status.RESURVEY_REQUIRED, label: "Yêu cầu hỗ trợ" }
              ]}
              value={status}
              placeholder="Chọn trạng thái"
              onChange={(value) => dispatch(changeStatus(value))} />
          </div>
          <Button variant="outline" className="w-full md:w-24 h-10 md:self-end" onClick={handleClearFilter}>
            <X className="size-4" />
            Xoá lọc
          </Button>
          <Button variant="outline" className="w-10 h-10 md:self-end" onClick={handleRefresh}>
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  resetPagination,
  changeStore,
  changeArea,
  changeStatus,
  clearFilter,
  changePage,
  changeDateRange
} from "@/features/submission/submission.slice";
import { getAreas } from "@/features/dashboard/dashboard.slice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { RefreshCcw } from "lucide-react";
import DateRangeFilter from "../ui/DateRangeFilter";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "SUBMITTED", label: "Đã khảo sát, chờ kiểm tra" },
  { value: "SUPERSEDED", label: "Đã được thay thế" },
  { value: "DELETED", label: "Đã xóa" },
  { value: "CANCELLED", label: "Đã huỷ" },
  { value: "RESURVEY_REJECTED", label: "Yêu cầu khảo sát lại bị từ chối" },
  { value: "PENDING_REVIEW", label: "Chờ phê duyệt" },
  { value: "REJECTED_REVIEW", label: "Bị từ chối" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "FAILED", label: "Không đạt" },
];

export function PendingReviewFilter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.submission.filter);
  const areas = useAppSelector((state) => state.dashboard.areas);
  const dashboardState = useAppSelector((state) => state.dashboard.requestState);

  useEffect(() => {
    dispatch(getAreas({}));
  }, [dispatch]);

  const handleStoreChange = (value: string) => {
    dispatch(changeStore(value));
    dispatch(changePage(1));
  };

  const handleAreaChange = (value: string) => {
    dispatch(changeArea(value));
    dispatch(changePage(1));
  };

  const handleStatusChange = (value: string) => {
    dispatch(changeStatus(value));
    dispatch(changePage(1));
  };

  const handleRefresh = () => {
    dispatch(clearFilter());
    dispatch(resetPagination());
  };

  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tên cửa hàng</Label>
            <Input
              isDebounce
              placeholder="Nhập tên cửa hàng"
              value={filter.store}
              onChange={(e) => handleStoreChange(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Combobox
              className="w-full"
              disabled={dashboardState.status === "loading" && dashboardState.type === "getAreas"}
              options={areas.map((area) => ({ label: area, value: area }))}
              value={filter.area}
              placeholder="Tất cả khu vực"
              onChange={handleAreaChange}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Trạng thái</Label>
            <Combobox
              className="w-full"
              options={STATUS_OPTIONS}
              value={filter.status}
              placeholder="Chọn trạng thái"
              onChange={(value) => handleStatusChange(value)}
            />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <Label>Ngày thực hiện</Label>
            <DateRangeFilter
              className="h-10!"
              dateRange={filter.dateRange}
              onDateChange={(dateRange) => {
                dispatch(changeDateRange(dateRange));
                dispatch(changePage(1));
              }}
            />
          </div>
          <Button
            variant="outline"
            className="h-10 md:self-end"
            onClick={handleRefresh}
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



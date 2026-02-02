"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { 
  getPendingSubmissions, 
  resetPagination, 
  changeStore, 
  changeStatus, 
  clearFilter,
  changePage 
} from "@/features/submission/submission.slice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "SUBMITTED", label: "Đã gửi" },
  { value: "SUPERSEDED", label: "Đã thay thế" },
  { value: "DELETED", label: "Đã xóa" },
  { value: "RESURVEY_REJECTED", label: "Đã bị từ chối khảo sát lại" },
  { value: "PENDING_REVIEW", label: "Đang chờ duyệt" },
  { value: "REJECTED_REVIEW", label: "Đã bị từ chối" },
];

export function PendingReviewFilter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.submission.filter);
  const pagination = useAppSelector((state) => state.submission.pagination);

  const handleStoreChange = (value: string) => {
    dispatch(changeStore(value));
    dispatch(changePage(1)); // Reset to page 1 when store filter changes
  };

  const handleStatusChange = (value: string) => {
    dispatch(changeStatus(value));
  };

  const handleRefresh = () => {
    dispatch(resetPagination());
    dispatch(getPendingSubmissions({ 
      skip: 0, 
      limit: pagination.limit, 
      status: filter.status || undefined 
    }));
  };

  const handleClear = () => {
    dispatch(clearFilter());
    dispatch(resetPagination());
    dispatch(getPendingSubmissions({ 
      skip: 0, 
      limit: pagination.limit, 
      status: "" 
    }));
  };

  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tên cửa hàng</Label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={filter.store}
              onChange={(e) => handleStoreChange(e.target.value)}
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
          <Button
            variant="outline"
            className="w-full md:w-28 h-10 md:self-end"
            onClick={handleClear}
          >
            Xoá lọc
          </Button>
          <Button
            variant="outline"
            className="w-full md:w-28 h-10 md:self-end"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



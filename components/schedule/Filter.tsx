import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { InputCalendar } from "../ui/InputCalendar";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { changeAssigneeId, changeDeadline, changeSearch, changeStatus, clearFilter, getTasks, resetPagination } from "@/features/schedule/schedule.slice";
import { Status } from "../ui/status-badge";
import { Button } from "../ui/button";
import { RefreshCcw, X } from "lucide-react";
import { SearchableCombobox } from "../ui/searchable-combobox";
import { searchUsers } from "@/features/staffs/staffs.slice";

export function Filter() {
  const dispatch = useAppDispatch();

  const q = useAppSelector((state) => state.schedule.filter.q);
  const assigneeId = useAppSelector((state) => state.schedule.filter.assigneeId);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);

  const status = useAppSelector((state) => state.schedule.filter.status);
  const deadline = useAppSelector((state) => state.schedule.filter.deadline);

  const handleClearFilter = () => {
    dispatch(clearFilter());
  }

  const handleChangeStaff = (value: string) => {
    dispatch(changeAssigneeId(value));
  }

  const handleSearchStaffs = (searchValue: string) => {
    const trimmedSearch = searchValue.trim();
    const params: any = {
      page: 1,
    };

    if (trimmedSearch) {
      params.q = trimmedSearch;
    } else {
      params.limit = 50;
    }

    dispatch(searchUsers(params));
  };

  const handleRefresh = () => {
    dispatch(clearFilter());
    dispatch(resetPagination());
    dispatch(getTasks({ page: 1, limit: 20 }));
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Cửa hàng</Label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={q}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Nhân viên</Label>
            <SearchableCombobox
              options={staffs.map(staff => ({
                value: staff.id,
                label: [staff.code, staff.name.length > 15 ? staff.name.substring(0, 15) + '...' : staff.name].filter(Boolean).join(' - '),
              }))}
              value={assigneeId || ""}
              onChange={handleChangeStaff}
              placeholder="Chọn nhân viên"
              className="w-full"
              isLoading={staffsRequestState.status === 'loading' && staffsRequestState.type === 'searchUsers'}
              onSearch={handleSearchStaffs}
            />
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
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none md:w-24 h-10 md:self-end" onClick={handleClearFilter}>
              <X className="size-4" />
              Xoá lọc
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none md:w-10 h-10 md:self-end" onClick={handleRefresh}>
              <RefreshCcw className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
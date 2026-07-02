"use client"

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Label } from "../ui/label";
import { InputCalendar } from "../ui/InputCalendar";
import { Combobox } from "../ui/combobox";
import { SearchableCombobox } from "../ui/searchable-combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { changeAssigneeId, changeCampaignId, changeDeadline, changeStatus, clearFilter } from "@/features/schedule/schedule.slice";
import { Status } from "../ui/status-badge";
import { searchUsers } from "@/features/staffs/staffs.slice";
import { FilterIcon } from "lucide-react";

export function FilterPopover() {
  const dispatch = useAppDispatch();

  const currentAssigneeId = useAppSelector((state) => state.schedule.filter.assigneeId);
  const currentCampaignId = useAppSelector((state) => state.schedule.filter.campaignId);
  const currentStatus = useAppSelector((state) => state.schedule.filter.status);
  const currentDeadline = useAppSelector((state) => state.schedule.filter.deadline);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);

  const [open, setOpen] = useState(false);
  const [localAssigneeId, setLocalAssigneeId] = useState(currentAssigneeId);
  const [localCampaignId, setLocalCampaignId] = useState(currentCampaignId);
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [localDeadline, setLocalDeadline] = useState<Date | undefined>(currentDeadline);

  const activeFilterCount = [currentAssigneeId, currentCampaignId, currentStatus, currentDeadline].filter(Boolean).length;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Sync local state with current store values when opening
      setLocalAssigneeId(currentAssigneeId);
      setLocalCampaignId(currentCampaignId);
      setLocalStatus(currentStatus);
      setLocalDeadline(currentDeadline);
    }
    setOpen(isOpen);
  };

  const handleApply = () => {
    dispatch(changeAssigneeId(localAssigneeId));
    dispatch(changeCampaignId(localCampaignId));
    dispatch(changeStatus(localStatus));
    dispatch(changeDeadline(localDeadline));
    setOpen(false);
  };

  const handleClear = () => {
    setLocalAssigneeId("");
    setLocalCampaignId("");
    setLocalStatus("");
    setLocalDeadline(undefined);
    dispatch(clearFilter());
    setOpen(false);
  };

  const handleSearchStaffs = (searchValue: string) => {
    const trimmedSearch = searchValue.trim();
    const params: any = { page: 1 };

    if (trimmedSearch) {
      params.q = trimmedSearch;
    } else {
      params.limit = 50;
    }

    dispatch(searchUsers(params));
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative shrink-0">
          <FilterIcon />
          {activeFilterCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2.5 -right-2.5 h-5 min-w-5 flex items-center justify-center p-0 text-[11px] leading-none"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-92" align="end">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Nhân viên</Label>
            <SearchableCombobox
              options={staffs.map(staff => ({
                value: staff.id,
                label: [staff.code, staff.name.length > 15 ? staff.name.substring(0, 15) + '...' : staff.name].filter(Boolean).join(' - '),
              }))}
              value={localAssigneeId || ""}
              onChange={setLocalAssigneeId}
              placeholder="Chọn nhân viên"
              className="w-full"
              isLoading={staffsRequestState.status === 'loading' && staffsRequestState.type === 'searchUsers'}
              onSearch={handleSearchStaffs}
            />
          </div>
          <div className="grid gap-2">
            <Label>Chiến dịch</Label>
            <Combobox
              className="w-full"
              options={campaigns.map(campaign => ({
                value: campaign._id,
                label: campaign.campaignName,
              }))}
              value={localCampaignId}
              placeholder="Chọn chiến dịch"
              onChange={setLocalCampaignId}
            />
          </div>
          <div className="grid gap-2">
            <Label>Hạn khảo sát</Label>
            <InputCalendar
              placeholder="Chọn hạn khảo sát"
              inputFormat="dd/MM/yyyy"
              value={localDeadline}
              onChange={(value) => setLocalDeadline(value ?? undefined)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <Combobox
              className="w-full"
              options={[
                { value: Status.COMPLETED, label: "Đã hoàn thành" },
                { value: Status.IN_PROGRESS, label: "Sắp diễn ra" },
                { value: Status.OVERDUE, label: "Quá hạn khảo sát" },
                { value: Status.RESURVEY_REQUIRED, label: "Yêu cầu hỗ trợ" },
                { value: Status.CANCELLED, label: "Đã huỷ" }
              ]}
              value={localStatus}
              placeholder="Chọn trạng thái"
              onChange={setLocalStatus}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Xoá lọc
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
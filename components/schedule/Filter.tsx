import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { InputCalendar } from "../ui/InputCalendar";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { changeAreaOrProvince, changeAssigneeId, changeCampaignId, changeDeadline, changeSearch, changeStatus } from "@/features/schedule/schedule.slice";
import { Status } from "../ui/status-badge";
import { SearchableCombobox } from "../ui/searchable-combobox";
import { searchUsers } from "@/features/staffs/staffs.slice";

export function Filter() {
  const dispatch = useAppDispatch();

  const q = useAppSelector((state) => state.schedule.filter.q);
  const assigneeId = useAppSelector((state) => state.schedule.filter.assigneeId);
  const areaOrProvince = useAppSelector((state) => state.schedule.filter.areaOrProvince);
  const campaignId = useAppSelector((state) => state.schedule.filter.campaignId);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);

  const status = useAppSelector((state) => state.schedule.filter.status);
  const deadline = useAppSelector((state) => state.schedule.filter.deadline);

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

  return (
    <Card>
      <CardContent>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 flex flex-col gap-2">
            <Label>Cửa hàng</Label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={q}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
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
          <div className="min-w-0 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Input
              placeholder="Nhập khu vực hoặc tỉnh/thành phố"
              value={areaOrProvince}
              onChange={(e) => dispatch(changeAreaOrProvince(e.target.value))} />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <Label>Chiến dịch</Label>
            <Combobox
              className="w-full"
              options={campaigns.map(campaign => ({
                value: campaign._id,
                label: campaign.campaignName,
              }))}
              value={campaignId}
              placeholder="Chọn chiến dịch"
              onChange={(value) => dispatch(changeCampaignId(value))} />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <Label>Hạn khảo sát</Label>
            <InputCalendar
              placeholder="Chọn hạn khảo sát"
              inputFormat="dd/MM/yyyy"

              value={deadline}
              onChange={(value) => dispatch(changeDeadline(value))}
            />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
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
        </div>
      </CardContent>
    </Card>
  )
} 
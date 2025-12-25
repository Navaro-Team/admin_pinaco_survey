import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { changeSearch, changeRole, changeStatus } from "@/features/staffs/staffs.slice";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export function Filter() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.staffs.filter.search);
  const role = useAppSelector((state) => state.staffs.filter.role);
  const status = useAppSelector((state) => state.staffs.filter.status);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tên hoặc Email</Label>
            <Input
              placeholder="Nhập tên hoặc email nhân viên"
              value={search}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Vai trò</Label>
            <Combobox
              className="w-full"
              options={[
                { value: "admin", label: "Quản trị viên" },
                { value: "manager", label: "Quản lý" },
                { value: "staff", label: "Nhân viên" },
              ]}
              value={role}
              placeholder="Chọn vai trò"
              onChange={(value) => dispatch(changeRole(value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Trạng thái</Label>
            <Combobox
              className="w-full"
              options={[
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
              value={status}
              placeholder="Chọn trạng thái"
              onChange={(value) => dispatch(changeStatus(value))} />
          </div>
          <Button variant="outline" className="w-full md:w-24 h-10 md:self-end">
            <Search className="size-4" />
            Lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


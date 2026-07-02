"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { changeAreaOrProvince, changeSearch } from "@/features/schedule/schedule.slice";
import { FilterPopover } from "./FilterPopover";

export function Filter() {
  const dispatch = useAppDispatch();

  const q = useAppSelector((state) => state.schedule.filter.q);
  const areaOrProvince = useAppSelector((state) => state.schedule.filter.areaOrProvince);

  return (
    <Card className="p-4!">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1 basis-50 flex flex-col gap-2">
            <Label>Cửa hàng</Label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={q}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="min-w-0 flex-1 basis-50 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Input
              placeholder="Nhập khu vực hoặc tỉnh/thành phố"
              value={areaOrProvince}
              onChange={(e) => dispatch(changeAreaOrProvince(e.target.value))} />
          </div>
          <FilterPopover />
        </div>
      </CardContent>
    </Card>
  )
}
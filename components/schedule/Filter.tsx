"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { changeAreaOrProvince, changeSearch } from "@/features/schedule/schedule.slice";
import { getAreas } from "@/features/dashboard/dashboard.slice";
import { FilterPopover } from "./FilterPopover";

export function Filter() {
  const dispatch = useAppDispatch();

  const q = useAppSelector((state) => state.schedule.filter.q);
  const areaOrProvince = useAppSelector((state) => state.schedule.filter.areaOrProvince);
  const areas = useAppSelector((state) => state.dashboard.areas);
  const dashboardState = useAppSelector((state) => state.dashboard.requestState);

  useEffect(() => {
    dispatch(getAreas({}));
  }, [dispatch]);

  return (
    <Card className="p-4!">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1 basis-50 flex flex-col gap-2">
            <Label>Cửa hàng</Label>
            <Input
              isDebounce
              placeholder="Nhập tên cửa hàng"
              value={q}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="min-w-0 flex-1 basis-50 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Combobox
              className="w-full"
              disabled={dashboardState.status === "loading" && dashboardState.type === "getAreas"}
              options={areas.map((area) => ({ label: area, value: area }))}
              value={areaOrProvince}
              placeholder="Tất cả khu vực"
              onChange={(value) => dispatch(changeAreaOrProvince(value))}
            />
          </div>
          <FilterPopover />
        </div>
      </CardContent>
    </Card>
  )
}
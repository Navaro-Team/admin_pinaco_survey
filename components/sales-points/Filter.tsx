"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { changeArea, changeProvince, changeSearch, clearFilter, getStores } from "@/features/sales-points/sales-points.slice";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

export function Filter() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.salesPoints.filter.search);
  const province = useAppSelector((state) => state.salesPoints.filter.province);
  const area = useAppSelector((state) => state.salesPoints.filter.area);

  const handleClearFilter = () => {
    dispatch(clearFilter());
  };

  const handleRefresh = () => {
    handleClearFilter();
    dispatch(getStores({}));
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tên hoặc Mã điểm bán</Label>
            <Input
              placeholder="Nhập tên hoặc mã điểm bán"
              value={search}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tỉnh/Thành phố</Label>
            <Input
              placeholder="Nhập tỉnh/thành phố"
              value={province}
              onChange={(e) => dispatch(changeProvince(e.target.value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Input
              placeholder="Nhập khu vực"
              value={area}
              onChange={(e) => dispatch(changeArea(e.target.value))} />
          </div>
          <Button
            variant="outline"
            className="w-10 h-10 md:self-end"
            onClick={handleRefresh}>
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


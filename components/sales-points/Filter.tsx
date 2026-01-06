"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { changeSearch, changeArea, clearFilter, getStores } from "@/features/sales-points/sales-points.slice";
import { Button } from "../ui/button";
import { RefreshCcw, X } from "lucide-react";

export function Filter() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.salesPoints.filter.search);
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
            <Label>Khu vực</Label>
            <Combobox
              className="w-full"
              options={[
                { value: "1", label: "Khu vực 1" },
                { value: "2", label: "Khu vực 2" },
                { value: "3", label: "Khu vực 3" },
                { value: "4", label: "Khu vực 4" },
              ]}
              value={area}
              placeholder="Chọn khu vực"
              onChange={(value) => dispatch(changeArea(value))} />
          </div>
          <Button
            variant="outline"
            className="w-full md:w-24 h-10 md:self-end"
            onClick={handleClearFilter}>
            <X className="size-4" />
            Xoá lọc
          </Button>
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


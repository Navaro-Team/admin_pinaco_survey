"use client";

import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import DateRangeFilter from "../ui/DateRangeFilter";
import { OpenQuestion16FilterState } from "@/features/openQuestion16/openQuestion16.types";

interface Props {
  value: OpenQuestion16FilterState;
  onChange: (value: OpenQuestion16FilterState) => void;
  isLoading?: boolean;
}

export function Filter({ value, onChange, isLoading }: Props) {
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const filterOptions = useAppSelector((state) => state.openQuestion16.filterOptions);

  const handleChangeDateRange = (range?: DateRange) => {
    onChange({
      ...value,
      startDate: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      endDate: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    });
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Đợt khảo sát</Label>
            <Combobox className="w-full" disabled={isLoading}
              options={campaigns.map((c) => ({ value: c._id, label: c.campaignName }))}
              value={value.campaignId} placeholder="Tất cả đợt khảo sát"
              onChange={(v) => onChange({ ...value, campaignId: v })} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Thời gian</Label>
            <DateRangeFilter
              className="w-full"
              dateRange={value.startDate && value.endDate ? { from: new Date(value.startDate), to: new Date(value.endDate) } : undefined}
              onDateChange={handleChangeDateRange} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Khu vực</Label>
            <Combobox className="w-full" disabled={isLoading}
              options={filterOptions.provinces.map((p) => ({ value: p, label: p }))}
              value={value.province} placeholder="Tất cả khu vực"
              onChange={(v) => onChange({ ...value, province: v })} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Nhóm điểm bán</Label>
            <Combobox className="w-full" disabled={isLoading}
              options={filterOptions.storeGroups.map((g) => ({ value: g, label: g }))}
              value={value.storeGroup} placeholder="Tất cả nhóm điểm bán"
              onChange={(v) => onChange({ ...value, storeGroup: v })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

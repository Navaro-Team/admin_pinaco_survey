"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { changeCampaignFilterSearch, changeCampaignFilterStatus, clearCampaignsState } from "@/features/campaigns/campaigns.slice";
import { Button } from "../ui/button";
import { RefreshCcw, X } from "lucide-react";
import { getCampaigns } from "@/features/campaigns/campaigns.slice";
import { CAMPAIGN_STATUS, CAMPAIGN_STATUS_LABELS } from "@/lib/campaigns.utils";

export function Filter() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.campaigns.filter.search);
  const status = useAppSelector((state) => state.campaigns.filter.status);

  const handleClearFilter = () => {
    dispatch(clearCampaignsState());
  };

  const handleRefresh = () => {
    handleClearFilter();
    dispatch(getCampaigns({ search: search, status: status, page: 1, limit: 50 }));
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Tên hoặc Mã chiến dịch</Label>
            <Input
              placeholder="Nhập tên hoặc mã chiến dịch"
              value={search}
              onChange={(e) => dispatch(changeCampaignFilterSearch(e.target.value))} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Trạng thái</Label>
            <Combobox
              className="w-full"
              options={[
                { value: CAMPAIGN_STATUS.DRAFT, label: CAMPAIGN_STATUS_LABELS.DRAFT },
                { value: CAMPAIGN_STATUS.SCHEDULED, label: CAMPAIGN_STATUS_LABELS.SCHEDULED },
                { value: CAMPAIGN_STATUS.ACTIVE, label: CAMPAIGN_STATUS_LABELS.ACTIVE },
                { value: CAMPAIGN_STATUS.ENDED, label: CAMPAIGN_STATUS_LABELS.ENDED },
                { value: CAMPAIGN_STATUS.ARCHIVED, label: CAMPAIGN_STATUS_LABELS.ARCHIVED },
              ]}
              value={status}
              placeholder="Chọn trạng thái"
              onChange={(value) => dispatch(changeCampaignFilterStatus(value))} />
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


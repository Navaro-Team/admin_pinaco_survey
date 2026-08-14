"use client"

import type { InventoryData } from "@/features/dashboard/dashboard.types"
import type { GlobalFilterState } from "./GlobalFilter"
import { AbsoluteInventoryTable } from "./inventory/AbsoluteInventoryTable"
import { InventoryShareByDistrict } from "./inventory/InventoryShareByDistrict"
import { CategoryInventoryShare } from "./inventory/CategoryInventoryShare"
import { InventoryHealth } from "./inventory/InventoryHealth"

interface InventoryDashboardProps {
  data?: InventoryData
  filter: GlobalFilterState
  isLoading?: boolean
  groupBy?: 'region' | 'province'
}

export function InventoryDashboard({ data, filter, isLoading, groupBy = 'region' }: InventoryDashboardProps) {
  return (
    <div className="mx-2 lg:mx-3 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Giá trị tồn kho</h2>

      <AbsoluteInventoryTable data={data?.absolute} isLoading={isLoading} groupBy={groupBy} />

      <InventoryShareByDistrict data={data?.share_by_region} isLoading={isLoading} groupBy={groupBy} />
      <CategoryInventoryShare data={data?.category_share} isLoading={isLoading} />

      <InventoryHealth filter={filter} />
    </div>
  )
}

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
}

export function InventoryDashboard({ data, filter, isLoading }: InventoryDashboardProps) {
  return (
    <div className="mx-2 lg:mx-3 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Giá trị tồn kho</h2>

      <AbsoluteInventoryTable data={data?.absolute} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InventoryShareByDistrict data={data?.share_by_region} isLoading={isLoading} />
        <CategoryInventoryShare data={data?.category_share} isLoading={isLoading} />
      </div>

      <InventoryHealth filter={filter} />
    </div>
  )
}

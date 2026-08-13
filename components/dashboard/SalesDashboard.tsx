"use client"

import type { SalesData } from "@/features/dashboard/dashboard.types"
import type { GlobalFilterState } from "./GlobalFilter"
import { AbsoluteSalesTable } from "./sales/AbsoluteSalesTable"
import { SowByDistrict } from "./sales/SowByDistrict"
import { CategorySow } from "./sales/CategorySow"
import { BusinessOutcome } from "./sales/BusinessOutcome"

interface SalesDashboardProps {
  data?: SalesData
  filter: GlobalFilterState
  isLoading?: boolean
}

export function SalesDashboard({ data, filter, isLoading }: SalesDashboardProps) {
  return (
    <div className="mx-2 lg:mx-3 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Doanh số bán ra</h2>

      <AbsoluteSalesTable data={data?.absolute} isLoading={isLoading} />

      <SowByDistrict data={data?.sow_by_region} isLoading={isLoading} />
      <CategorySow data={data?.category_sow} isLoading={isLoading} />

      <BusinessOutcome filter={filter} />
    </div>
  )
}

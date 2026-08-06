"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { OverviewKPIs } from "@/components/dashboard/OverviewKPIs"
import { SalesDashboard } from "@/components/dashboard/SalesDashboard"
import { InventoryDashboard } from "@/components/dashboard/InventoryDashboard"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getDashboardOverview, getBusinessOutcome, getInventoryHealth } from "@/features/dashboard/dashboard.slice"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER);
  const data = useAppSelector(state => state.dashboard.dashboardOverview);
  const requestState = useAppSelector(state => state.dashboard.requestState);
  const isLoading = requestState.status === "loading" && requestState.type === "getDashboardOverview";
  const error = requestState.status === "failed" ? requestState.error : undefined;

  useEffect(() => {
    dispatch(getDashboardOverview(filter))
    dispatch(getBusinessOutcome({ ...filter, page: 1, limit: 20 }))
    dispatch(getInventoryHealth({ ...filter, page: 1, limit: 20 }))
  }, [filter])

  return (
    <div className="flex flex-col gap-3 py-3">
      {/* Section 1: Bộ lọc toàn cục */}
      <GlobalFilter value={filter} onChange={setFilter} />

      {error && (
        <div className="mx-2 lg:mx-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Section 2: Chỉ số tổng quan */}
      <OverviewKPIs data={data?.kpis} isLoading={isLoading} />

      {/* Section 3: Doanh số bán ra */}
      <SalesDashboard data={data?.sales} filter={filter} isLoading={isLoading} />

      {/* Section 4: Giá trị tồn kho */}
      <InventoryDashboard data={data?.inventory} filter={filter} isLoading={isLoading} />
    </div>
  )
}

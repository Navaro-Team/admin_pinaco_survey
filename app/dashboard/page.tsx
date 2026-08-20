"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { OverviewKPIs } from "@/components/dashboard/OverviewKPIs"
import { SalesDashboard } from "@/components/dashboard/SalesDashboard"
import { InventoryDashboard } from "@/components/dashboard/InventoryDashboard"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getDashboardOverview, getBusinessOutcome, getInventoryHealth } from "@/features/dashboard/dashboard.slice"
import { useToastContext } from "@/context/ToastContext"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const dispatch = useAppDispatch();
  const { error } = useToastContext();
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER);
  const [overviewBrand, setOverviewBrand] = useState<string>("pinaco");
  const data = useAppSelector(state => state.dashboard.dashboardOverview);
  const requestState = useAppSelector(state => state.dashboard.requestState);
  const isLoading = requestState.status === "loading";
  const errorDashboard = requestState.status === "failed" ? requestState.error : undefined;

  useEffect(() => {
    dispatch(getBusinessOutcome({ ...filter, page: 1, limit: 20 }))
    dispatch(getInventoryHealth({ ...filter, page: 1, limit: 20 }))
  }, [filter])

  useEffect(() => {
    dispatch(getDashboardOverview({ ...filter, brand: overviewBrand }))
  }, [filter, overviewBrand])

  useEffect(() => {
    if (errorDashboard) {
      error("Lỗi tổng hợp dữ liệu", errorDashboard)
    }
  }, [errorDashboard])

  return (
    <div className="flex flex-col gap-3 py-3">
      {/* Section 1: Bộ lọc toàn cục */}
      <GlobalFilter value={filter} onChange={setFilter} />

      {/* Section 2: Chỉ số tổng quan */}
      <OverviewKPIs data={data?.kpis} isLoading={isLoading} brand={overviewBrand} onBrandChange={setOverviewBrand} />

      {/* Section 3: Doanh số bán ra */}
      <SalesDashboard data={data?.sales} filter={filter} isLoading={isLoading && requestState.type === "getBusinessOutcome"} groupBy={data?.group_by} />

      {/* Section 4: Giá trị tồn kho */}
      <InventoryDashboard data={data?.inventory} filter={filter} isLoading={isLoading && requestState.type === "getInventoryHealth"} groupBy={data?.group_by} />
    </div>
  )
}

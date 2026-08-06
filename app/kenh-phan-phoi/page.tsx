"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { DistributionStats } from "@/components/dashboard/distribution/DistributionStats"
import { RouteSegmentation } from "@/components/dashboard/distribution/RouteSegmentation"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getDashboardDistribution } from "@/features/dashboard/dashboard.slice"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER)
  const dispatch = useAppDispatch()
  const distribution = useAppSelector((state) => state.dashboard.dashboardDistribution)
  const requestState = useAppSelector((state) => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getDashboardDistribution"

  useEffect(() => {
    dispatch(getDashboardDistribution({
      region: filter.region,
      staff: filter.staff,
      businessType: filter.businessType,
    }) as any)
  }, [filter.region, filter.staff, filter.businessType])

  return (
    <div className="flex flex-col gap-3 py-3">
      <GlobalFilter value={filter} onChange={setFilter} />

      <div className="mx-2 lg:mx-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Kênh phân phối</h2>
        <DistributionStats data={distribution?.channel_stats} isLoading={isLoading} />
        <RouteSegmentation data={distribution?.route_segmentation} isLoading={isLoading} />
      </div>
    </div>
  )
}

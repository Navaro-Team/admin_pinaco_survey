"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { AbsoluteVolumeTable } from "@/components/dashboard/volume/AbsoluteVolumeTable"
import { TerritoryMapping } from "@/components/dashboard/volume/TerritoryMapping"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getDashboardVolume } from "@/features/dashboard/dashboard.slice"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER)
  const dispatch = useAppDispatch()
  const volume = useAppSelector((state) => state.dashboard.dashboardVolume)
  const requestState = useAppSelector((state) => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getDashboardVolume"

  useEffect(() => {
    dispatch(getDashboardVolume({
      region: filter.region,
      staff: filter.staff,
      businessType: filter.businessType,
    }) as any)
  }, [filter.region, filter.staff, filter.businessType])

  return (
    <div className="flex flex-col gap-3 py-3">
      <GlobalFilter value={filter} onChange={setFilter} />

      <div className="mx-2 lg:mx-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Thị phần sản lượng</h2>
        <AbsoluteVolumeTable data={volume?.absolute} isLoading={isLoading} />
        <TerritoryMapping data={volume?.territory} summary={volume?.summary} isLoading={isLoading} />
      </div>
    </div>
  )
}

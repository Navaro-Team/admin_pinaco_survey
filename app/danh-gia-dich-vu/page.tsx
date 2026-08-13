"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { ServiceKPIs } from "@/components/dashboard/service/ServiceKPIs"
import { ServiceRadarChart } from "@/components/dashboard/service/ServiceRadarChart"
import { ServiceStatsTable } from "@/components/dashboard/service/ServiceStatsTable"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getServiceEval } from "@/features/dashboard/dashboard.slice"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER)
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.dashboard.serviceEval)
  const requestState = useAppSelector((state) => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getServiceEval"

  useEffect(() => {
    dispatch(getServiceEval({
      region: filter.region,
      staff: filter.staff,
      businessType: filter.businessType,
    }) as any)
  }, [filter.region, filter.staff, filter.businessType])

  return (
    <div className="flex flex-col gap-3 py-3">
      <GlobalFilter value={filter} onChange={setFilter} />

      <div className="mx-2 lg:mx-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Đánh giá dịch vụ PINACO</h2>

        <ServiceKPIs data={data?.kpi_summary} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ServiceRadarChart data={data?.satisfaction_by_criteria} isLoading={isLoading} />
          <ServiceStatsTable data={data?.service_grid} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

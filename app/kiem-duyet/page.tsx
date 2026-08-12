"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { QCKPIs } from "@/components/dashboard/qc/QCKPIs"
import { QCDonutCharts } from "@/components/dashboard/qc/QCDonutCharts"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getQCDashboard } from "@/features/dashboard/dashboard.slice"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER)
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.dashboard.qcDashboard)
  const requestState = useAppSelector((state) => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getQCDashboard"

  useEffect(() => {
    dispatch(getQCDashboard({
      region: filter.region,
      staff: filter.staff,
      businessType: filter.businessType,
    }) as any)
  }, [filter.region, filter.staff, filter.businessType])

  return (
    <div className="flex flex-col gap-3 py-3">
      <GlobalFilter value={filter} onChange={setFilter} />

      <div className="mx-2 lg:mx-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Kiểm duyệt / QC</h2>

        <QCKPIs data={data} isLoading={isLoading} />

        <QCDonutCharts data={data} isLoading={isLoading} />
      </div>
    </div>
  )
}

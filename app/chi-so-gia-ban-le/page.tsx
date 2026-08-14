"use client"

import { useEffect, useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { InternalPriceGap } from "@/components/dashboard/pricing/InternalPriceGap"
import { CompetitivePricing } from "@/components/dashboard/pricing/CompetitivePricing"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getDashboardPricing, getPricingTable } from "@/features/dashboard/dashboard.slice"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER)
  const dispatch = useAppDispatch()
  const pricing = useAppSelector((state) => state.dashboard.dashboardPricing)
  const requestState = useAppSelector((state) => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getDashboardPricing"

  useEffect(() => {
    dispatch(getDashboardPricing({
      region: filter.region,
      staff: filter.staff,
      businessType: filter.businessType,
    }) as any)
    dispatch(getPricingTable({
      region: filter.region,
      staff: filter.staff,
      businessType: filter.businessType,
      page: 1,
      limit: 20,
    }) as any)
  }, [filter.region, filter.staff, filter.businessType])

  return (
    <div className="flex flex-col gap-3 py-3">
      <GlobalFilter value={filter} onChange={setFilter} />

      <div className="mx-2 lg:mx-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Chỉ số giá bán lẻ</h2>
        <InternalPriceGap
          boxData={pricing?.internal_price_gap?.box_data}
          filter={filter}
          isLoading={isLoading}
          groupBy={filter.region ? 'province' : 'region'}
        />
        <CompetitivePricing
          data={pricing?.competitive}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

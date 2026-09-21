"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/report-open-question-16/Header"
import { Filter } from "@/components/report-open-question-16/Filter"
import { ReportContent } from "@/components/report-open-question-16/ReportContent"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getOpenQuestion16FilterOptions, getOpenQuestion16Report } from "@/features/openQuestion16/openQuestion16.slice"
import { getCampaigns } from "@/features/campaigns/campaigns.slice"
import { OpenQuestion16FilterState } from "@/features/openQuestion16/openQuestion16.types"

const DEFAULT_FILTER: OpenQuestion16FilterState = {
  campaignId: "",
  startDate: "",
  endDate: "",
  province: "",
  storeGroup: "",
}

export default function Page() {
  const [filter, setFilter] = useState<OpenQuestion16FilterState>(DEFAULT_FILTER)
  const dispatch = useAppDispatch()
  const report = useAppSelector((state) => state.openQuestion16.report)
  const requestState = useAppSelector((state) => state.openQuestion16.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getOpenQuestion16Report"

  useEffect(() => {
    dispatch(getCampaigns({}) as any)
    dispatch(getOpenQuestion16FilterOptions({}) as any)
  }, [dispatch])

  useEffect(() => {
    dispatch(getOpenQuestion16Report(filter) as any)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.campaignId, filter.startDate, filter.endDate, filter.province, filter.storeGroup])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Header />
      <Filter value={filter} onChange={setFilter} isLoading={isLoading} />
      <ReportContent
        report={report}
        isLoading={isLoading}
        error={requestState.status === "failed" ? requestState.error : undefined}
      />
    </div>
  )
}

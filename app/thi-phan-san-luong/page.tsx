"use client"

import { useState } from "react"
import { GlobalFilter, type GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { AbsoluteVolumeTable } from "@/components/dashboard/volume/AbsoluteVolumeTable"
import { TerritoryMapping } from "@/components/dashboard/volume/TerritoryMapping"

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export default function Page() {
  const [filter, setFilter] = useState<GlobalFilterState>(DEFAULT_FILTER)

  return (
    <div className="flex flex-col gap-3 py-3">
      <GlobalFilter value={filter} onChange={setFilter} />

      <div className="mx-2 lg:mx-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Thị phần sản lượng</h2>
        <AbsoluteVolumeTable />
        <TerritoryMapping />
      </div>
    </div>
  )
}

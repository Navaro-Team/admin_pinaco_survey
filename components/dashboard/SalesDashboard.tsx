"use client"

import { AbsoluteSalesTable } from "./sales/AbsoluteSalesTable"
import { SowByDistrict } from "./sales/SowByDistrict"
import { CategorySow } from "./sales/CategorySow"
import { BusinessOutcome } from "./sales/BusinessOutcome"

export function SalesDashboard() {
  return (
    <div className="mx-2 lg:mx-3 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Doanh số bán ra</h2>

      <AbsoluteSalesTable />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SowByDistrict />
        <CategorySow />
      </div>

      <BusinessOutcome />
    </div>
  )
}

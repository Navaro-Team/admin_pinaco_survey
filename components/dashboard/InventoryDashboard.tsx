"use client"

import { AbsoluteInventoryTable } from "./inventory/AbsoluteInventoryTable"
import { InventoryShareByDistrict } from "./inventory/InventoryShareByDistrict"
import { CategoryInventoryShare } from "./inventory/CategoryInventoryShare"
import { InventoryHealth } from "./inventory/InventoryHealth"

export function InventoryDashboard() {
  return (
    <div className="mx-2 lg:mx-3 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Giá trị tồn kho</h2>

      <AbsoluteInventoryTable />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InventoryShareByDistrict />
        <CategoryInventoryShare />
      </div>

      <InventoryHealth />
    </div>
  )
}

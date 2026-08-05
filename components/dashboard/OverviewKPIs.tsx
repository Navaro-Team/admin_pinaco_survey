"use client"

import { Circle } from "lucide-react"

type KPI = {
  label: string
  value: string
  unit: string
}

const KPI_DATA: KPI[] = [
  { label: "Cửa hàng khảo sát hợp lệ", value: "1.248", unit: "cửa hàng đã Q/C" },
  { label: "Quy mô thị trường tuyệt đối", value: "186,4 tỷ", unit: "VNĐ / tháng" },
  { label: "Overall SOW PINACO", value: "34,8%", unit: "Tỷ trọng doanh thu" },
  { label: "Overall Inventory Share PINACO", value: "31,2%", unit: "Tỷ trọng tồn kho" },
  { label: "Overall Volume Share PINACO", value: "29,6%", unit: "Mean sản lượng PINACO / 10 bình" },
]

export function OverviewKPIs() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 mx-2 lg:mx-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Chỉ số tổng quan</h2>
        <span className="flex items-center gap-1 text-xs text-blue-600">
          <Circle className="w-2.5 h-2.5 fill-blue-500 text-blue-500" />
          Cập nhật theo bộ lọc toàn cục
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {KPI_DATA.map((kpi) => (
          <div key={kpi.label} className="border rounded-lg p-2 flex flex-col items-center text-center gap-1">
            <span className="text-sm text-gray-500 leading-tight">{kpi.label}</span>
            <span className="text-3xl font-bold text-blue-600">{kpi.value}</span>
            <span className="text-xs text-gray-400">{kpi.unit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

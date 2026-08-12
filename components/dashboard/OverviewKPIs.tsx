"use client"

import { Circle } from "lucide-react"
import type { KpiSummary } from "@/features/dashboard/dashboard.types"
import { SkeletonBlock } from "@/components/dashboard/common/Skeleton"

interface OverviewKPIsProps {
  data?: KpiSummary
  isLoading?: boolean
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n)
}

export function OverviewKPIs({ data, isLoading }: OverviewKPIsProps) {
  if (isLoading && !data) {
    return (
      <div className="bg-white border rounded-xl px-3 py-2.5 mx-2 lg:mx-3">
        <div className="flex items-center justify-between mb-3">
          <SkeletonBlock className="h-5 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-2 flex flex-col items-center gap-2">
              <SkeletonBlock className="h-3.5 w-3/4" />
              <SkeletonBlock className="h-8 w-1/2" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const kpis = data
    ? [
        {
          label: "Cửa hàng khảo sát hợp lệ",
          value: formatNumber(data.valid_store_count),
          unit: "cửa hàng đã Q/C",
        },
        {
          label: "Quy mô thị trường tuyệt đối",
          value: `${data.market_size_billion_vnd.toLocaleString("vi-VN")} tỷ`,
          unit: "VNĐ / tháng",
        },
        {
          label: "Overall SOW PINACO",
          value: `${data.overall_sow_pct}%`,
          unit: "Tỷ trọng doanh thu",
        },
        {
          label: "Overall Inventory Share PINACO",
          value: `${data.overall_inventory_share_pct}%`,
          unit: "Tỷ trọng tồn kho",
        },
        {
          label: "Overall Volume Share PINACO",
          value: `${data.overall_volume_share_pct}%`,
          unit: "Mean sản lượng PINACO / 10 bình",
        },
      ]
    : [
        { label: "Cửa hàng khảo sát hợp lệ", value: "—", unit: "cửa hàng đã Q/C" },
        { label: "Quy mô thị trường tuyệt đối", value: "—", unit: "VNĐ / tháng" },
        { label: "Overall SOW PINACO", value: "—", unit: "Tỷ trọng doanh thu" },
        { label: "Overall Inventory Share PINACO", value: "—", unit: "Tỷ trọng tồn kho" },
        { label: "Overall Volume Share PINACO", value: "—", unit: "Mean sản lượng PINACO / 10 bình" },
      ]

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
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border rounded-lg p-2 flex flex-col items-center text-center gap-1">
            <span className="text-sm text-gray-500 leading-tight">{kpi.label}</span>
            <span className={`text-3xl font-bold text-blue-600 ${isLoading ? "opacity-40 animate-pulse" : ""}`}>
              {kpi.value}
            </span>
            <span className="text-xs text-gray-400">{kpi.unit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

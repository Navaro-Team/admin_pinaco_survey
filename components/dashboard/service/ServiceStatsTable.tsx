"use client"

import type { ServiceCriterionRow } from "@/features/dashboard/dashboard.types"
import { SkeletonTable } from "@/components/dashboard/common/Skeleton"
import { cn } from "@/lib/utils"

// Tiêu chí comparison — max 3
const COMPARISON_CODES = new Set([
  "PINACO_PROMOTION_COMPARISON",
  "PINACO_WARRANTY_COMPARISON",
  "PINACO_DELIVERY_COMPARISON",
])

function scoreColor(mean: number, max: number) {
  const pct = max > 0 ? mean / max : 0
  if (pct >= 0.8) return "text-emerald-600 font-semibold"
  if (pct >= 0.6) return "text-blue-600 font-semibold"
  if (pct >= 0.4) return "text-amber-600 font-semibold"
  return "text-red-600 font-semibold"
}

interface Props {
  data?: ServiceCriterionRow[]
  isLoading?: boolean
}

export function ServiceStatsTable({ data, isLoading }: Props) {
  if (isLoading) return <SkeletonTable rows={9} cols={6} />
  const rows = data ?? []

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <h3 className="text-base font-bold text-blue-700 mb-0.5">Bảng thống kê dịch vụ</h3>
      <p className="text-xs text-gray-400 mb-2">Thấp nhất · Trung bình · Cao nhất · Phổ biến nhất</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left font-bold text-gray-700 px-3 py-2 rounded-tl-lg">Tiêu chí</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2">Số mẫu</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2">Thấp nhất</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2">Trung bình</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2">Cao nhất</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 rounded-tr-lg">Phổ biến nhất</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-sm">Chưa có dữ liệu</td></tr>
            )}
            {rows.map((row) => {
              const max = COMPARISON_CODES.has(row.code) ? 3 : 5
              return (
                <tr key={row.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 text-gray-700">{row.criteria_name}</td>
                  <td className="px-3 py-2.5 text-center text-gray-500">{row.sample_count}</td>
                  <td className="px-3 py-2.5 text-center text-gray-500">{row.min}</td>
                  <td className={cn("px-3 py-2.5 text-center", scoreColor(row.mean, max))}>
                    {row.mean.toFixed(1)}
                  </td>
                  <td className="px-3 py-2.5 text-center text-gray-500">{row.max}</td>
                  <td className="px-3 py-2.5 text-center text-gray-500">{row.mode}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

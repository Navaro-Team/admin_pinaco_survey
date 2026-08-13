"use client"

import { cn } from "@/lib/utils"
import { SkeletonTable } from "@/components/dashboard/common/Skeleton"

type RouteType = "le" | "hon_hop" | "si"

type AreaRow = {
  area_name: string
  sample_count: number
  retail_pct: number
  wholesale_pct: number
  dominant_route: RouteType
}

const ROUTE_CONFIG: Record<RouteType, { label: string; className: string }> = {
  le:      { label: "Tuyến Lẻ",     className: "bg-blue-600 text-white" },
  hon_hop: { label: "Tuyến Hỗn hợp", className: "bg-orange-400 text-white" },
  si:      { label: "Tuyến Sỉ",     className: "bg-purple-600 text-white" },
}


function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-9 text-right shrink-0">{pct}%</span>
    </div>
  )
}

interface Props {
  data?: AreaRow[]
  isLoading?: boolean
}

export function DistributionStats({ data, isLoading }: Props) {
  if (isLoading && !data) return <SkeletonTable rows={4} cols={5} />
  const rows = data ?? []

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <h3 className="text-base font-bold text-blue-700 mb-3">1. THỐNG KÊ KÊNH PHÂN PHỐI</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left font-bold text-gray-700 px-3 py-2 rounded-tl-lg">Khu vực</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 w-24">Số mẫu (N)</th>
              <th className="font-bold text-gray-700 px-3 py-2">Bán lẻ trung bình</th>
              <th className="font-bold text-gray-700 px-3 py-2">Bán sỉ trung bình</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 rounded-tr-lg w-36">Nhóm tuyến nổi trội</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 text-sm py-8">Chưa có dữ liệu</td>
              </tr>
            )}
            {rows.map((row) => {
              const cfg = ROUTE_CONFIG[row.dominant_route]
              return (
                <tr key={row.area_name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-gray-700">{row.area_name}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600">{row.sample_count}</td>
                  <td className="px-3 py-2.5">
                    <ProgressBar pct={row.retail_pct} color="#1565C0" />
                  </td>
                  <td className="px-3 py-2.5">
                    <ProgressBar pct={row.wholesale_pct} color="#7C3AED" />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn("inline-block px-3 py-1 rounded-md text-xs font-semibold", cfg.className)}>
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

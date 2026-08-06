"use client"

import { cn } from "@/lib/utils"

type Zone = "green" | "yellow" | "red"

type TerritoryRow = {
  rank: number
  area_id: string
  area_name: string
  sample_count: number
  pinaco_mean: number       // /10 bình
  zone: Zone
  main_competitor: string   // "GS — 1,5/10" hoặc "Yamato & Thiên Năng — 5,5/10"
}

type VolumeSummary = {
  avg_pinaco_per_10: number
  avg_pinaco_pct: number
}

const ZONE_CONFIG: Record<Zone, { label: string; badgeClass: string; textClass: string; zoneLabel: string; rowClass: string }> = {
  green: { label: "Vùng Xanh", zoneLabel: "Vùng Xanh — Thống lĩnh", badgeClass: "bg-green-600 text-white", textClass: "text-green-700", rowClass: "bg-green-50" },
  yellow: { label: "Vùng Vàng", zoneLabel: "Vùng Vàng — Cạnh tranh", badgeClass: "bg-orange-400 text-white", textClass: "text-orange-600", rowClass: "bg-orange-50" },
  red: { label: "Vùng Đỏ", zoneLabel: "Vùng Đỏ — Báo động", badgeClass: "bg-red-500 text-white", textClass: "text-red-600", rowClass: "bg-red-50" },
}

const LEGEND = [
  { zone: "green" as Zone, rule: "≥ 6/10" },
  { zone: "yellow" as Zone, rule: "từ 4 đến < 6/10" },
  { zone: "red" as Zone, rule: "< 4/10" },
]

interface Props {
  data?: TerritoryRow[]
  summary?: VolumeSummary
  isLoading?: boolean
}

export function TerritoryMapping({ data, summary, isLoading }: Props) {
  const rows = data ?? []
  const kpi = summary ?? { avg_pinaco_per_10: 0, avg_pinaco_pct: 0 }

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      {/* Header row: title + KPI */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <h3 className="text-base font-bold text-blue-700">2. ĐỊNH VỊ LÃNH THỔ — TERRITORY MAPPING</h3>
        <div className="text-right shrink-0">
          <p className="text-xs text-blue-600 font-medium">Thị phần sản lượng PINACO trung bình</p>
          <div className="flex items-baseline gap-3 justify-end">
            <span className="text-2xl font-bold text-blue-700">{kpi.avg_pinaco_per_10.toFixed(1)}/10 bình</span>
            <span className="text-lg font-bold text-blue-500">{kpi.avg_pinaco_pct}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-3">
        {LEGEND.map(({ zone, rule }) => {
          const cfg = ZONE_CONFIG[zone]
          return (
            <div key={zone} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: zone === "green" ? "#16a34a" : zone === "yellow" ? "#f59e0b" : "#ef4444" }} />
              <span className="font-semibold">{cfg.label}:</span> {rule}
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-160 border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-center font-bold text-gray-700 px-3 py-2 w-16 border border-blue-100 rounded-tl-lg">Xếp hạng</th>
              <th className="text-left font-bold text-gray-700 px-3 py-2 border border-blue-100">Khu vực</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 w-24 border border-blue-100">Số mẫu (N)</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 w-36 border border-blue-100">PINACO (/10 bình)</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 border border-blue-100">Phân loại lãnh thổ</th>
              <th className="text-left font-bold text-gray-700 px-3 py-2 border border-blue-100 rounded-tr-lg">Đối thủ chính</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 text-sm py-8 border border-gray-200">Chưa có dữ liệu</td>
              </tr>
            )}
            {rows.map((row) => {
              const cfg = ZONE_CONFIG[row.zone]
              return (
                <tr key={row.area_id} className={cn("transition-colors", cfg.rowClass)}>
                  <td className="px-3 py-2.5 text-center font-semibold text-gray-500 border border-gray-200">{row.rank}</td>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 border border-gray-200">{row.area_name}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600 border border-gray-200">{row.sample_count}</td>
                  <td className="px-3 py-2.5 text-center border border-gray-200">
                    <span className={cn("inline-block min-w-12 px-3 py-1 rounded-md text-sm font-bold", cfg.badgeClass)}>
                      {row.pinaco_mean.toFixed(1)}
                    </span>
                  </td>
                  <td className={cn("px-3 py-2.5 font-medium border border-gray-200 text-center", cfg.textClass)}>{cfg.zoneLabel}</td>
                  <td className="px-3 py-2.5 text-gray-600 border border-gray-200">{row.main_competitor}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

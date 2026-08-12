"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LabelList,
} from "recharts"
import { Info } from "lucide-react"

import { SkeletonChart } from "@/components/dashboard/common/Skeleton"

type RouteType = "le" | "hon_hop" | "si"

type AreaSegment = {
  area_name: string
  le_count: number
  le_pct: number
  hon_hop_count: number
  hon_hop_pct: number
  si_count: number
  si_pct: number
  total_count: number
}

const ROUTE_COLORS: Record<RouteType, string> = {
  le: "#1565C0",
  hon_hop: "#F59E0B",
  si: "#7C3AED",
}

const ROUTE_LABELS: Record<RouteType, string> = {
  le: "Tuyến Lẻ",
  hon_hop: "Tuyến Hỗn hợp",
  si: "Tuyến Sỉ",
}


const RULES: { type: RouteType; rule: string }[] = [
  { type: "le", rule: "Bán lẻ ≥ 70%" },
  { type: "hon_hop", rule: "Bán lẻ > 30% và < 70%" },
  { type: "si", rule: "Bán sỉ ≥ 70%" },
]

function makeCustomTooltip(rows: AreaSegment[]) {
  return function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const row = rows.find((r) => r.area_name === label)
    const hovered = payload[0]
    const routeKey = (hovered?.dataKey as string)?.replace("_pct", "") as RouteType
    const count = row ? (routeKey === "le" ? row.le_count : routeKey === "hon_hop" ? row.hon_hop_count : row.si_count) : 0
    const total = row?.total_count ?? 0

    return (
      <div className="bg-white border rounded-lg px-3 py-2 shadow text-xs space-y-0.5">
        <p className="font-semibold text-gray-700">{label} — {ROUTE_LABELS[routeKey]}</p>
        <p className="text-gray-500">{count}/{total} cửa hàng</p>
        <p style={{ color: ROUTE_COLORS[routeKey] }} className="font-bold">{hovered?.value}%</p>
      </div>
    )
  }
}

interface Props {
  data?: AreaSegment[]
  isLoading?: boolean
}

export function RouteSegmentation({ data, isLoading }: Props) {
  if (isLoading && !data) return <SkeletonChart height={300} />
  const rows = data ?? []
  const CustomTooltip = makeCustomTooltip(rows)
  const chartData = rows.map((r) => ({
    name: r.area_name,
    le_pct: r.le_pct,
    hon_hop_pct: r.hon_hop_pct,
    si_pct: r.si_pct,
  }))

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <h3 className="text-base font-bold text-blue-700 mb-3">2. ROUTE SEGMENTATION — PHÂN CỤM TUYẾN</h3>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Stacked bar chart */}
        <div className="flex-1 min-w-0">
          {chartData.length === 0 && (
            <div className="flex items-center justify-center h-75 text-gray-400 text-sm">Chưa có dữ liệu</div>
          )}
          <ResponsiveContainer width="100%" height={chartData.length === 0 ? 0 : 420}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="square"
                wrapperStyle={{ fontSize: 12 }}
                formatter={(v) => {
                  const key = v.replace("_pct", "") as RouteType
                  return ROUTE_LABELS[key]
                }}
              />
              <Bar dataKey="le_pct" stackId="a" fill={ROUTE_COLORS.le} name="le_pct">
                <LabelList dataKey="le_pct" position="center" style={{ fontSize: 11, fill: "#fff", fontWeight: 600 }} formatter={(v: number) => v >= 10 ? `${v}%` : ""} />
              </Bar>
              <Bar dataKey="hon_hop_pct" stackId="a" fill={ROUTE_COLORS.hon_hop} name="hon_hop_pct">
                <LabelList dataKey="hon_hop_pct" position="center" style={{ fontSize: 11, fill: "#fff", fontWeight: 600 }} formatter={(v: number) => v >= 10 ? `${v}%` : ""} />
              </Bar>
              <Bar dataKey="si_pct" stackId="a" fill={ROUTE_COLORS.si} name="si_pct" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="si_pct" position="center" style={{ fontSize: 11, fill: "#fff", fontWeight: 600 }} formatter={(v: number) => v >= 10 ? `${v}%` : ""} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rules panel */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="border rounded-xl px-4 py-3 bg-gray-50 h-full flex flex-col gap-3 justify-center">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Quy tắc phân loại</p>
            <div className="flex flex-col gap-2.5">
              {RULES.map(({ type, rule }) => (
                <div key={type} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: ROUTE_COLORS[type] }}
                  />
                  <div className="text-xs text-gray-700">
                    <span className="font-semibold">{ROUTE_LABELS[type]}:</span>{" "}
                    <span className="text-gray-500">{rule}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex items-start gap-1.5 text-xs text-gray-500">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
              <span>Mỗi cửa hàng chỉ thuộc một nhóm tuyến.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

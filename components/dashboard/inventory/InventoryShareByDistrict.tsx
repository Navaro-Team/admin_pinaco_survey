"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"
import { BRAND_COLORS, BRAND_KEYS, type RegionBrandPct } from "@/features/dashboard/dashboard.types"
import { SkeletonChart } from "@/components/dashboard/common/Skeleton"

const BRAND_LABELS: Record<string, string> = {
  pinaco: "PINACO", gs: "GS", enimac: "Enimac", globe: "Globe",
  thien_nang: "Thiên Năng", yamato: "Yamato", xupai: "Xupai", cuu_hoi: "Cứu Hội", khac: "Khác",
}

interface Props {
  data?: RegionBrandPct[]
  isLoading?: boolean
  groupBy?: 'region' | 'province'
}

export function InventoryShareByDistrict({ data, isLoading, groupBy = 'region' }: Props) {
  if (isLoading) return <SkeletonChart height={330} />
  const chartData = (data ?? []).map((row) => {
    const item: Record<string, any> = { name: row.region_name }
    row.brands.forEach((b) => { item[b.brand.toLowerCase()] = b.pct })
    return item
  })

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <h3 className="text-base font-bold text-blue-700 mb-2">{groupBy === 'province' ? '2. INVENTORY SHARE — THEO TỈNH THÀNH' : '2. INVENTORY SHARE — TỶ TRỌNG TỒN KHO'}</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[330px] text-gray-400 text-sm">Chưa có dữ liệu</div>
      ) : (
        <ResponsiveContainer width="100%" height={330}>
          <BarChart data={chartData} stackOffset="expand" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value: number) => `${Math.round(value)}%`} />
            <Legend iconType="square" wrapperStyle={{ fontSize: 12, paddingTop: 16 }} formatter={(v) => BRAND_LABELS[v] ?? v} />
            {BRAND_KEYS.map((brand) => (
              <Bar key={brand} dataKey={brand} stackId="a" fill={BRAND_COLORS[brand]} name={brand}>
                <LabelList
                  dataKey={brand}
                  position="center"
                  style={{ fontSize: 10, fill: "#fff", fontWeight: 600 }}
                  formatter={(v: number) => (v >= 5 ? `${v}%` : "")}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

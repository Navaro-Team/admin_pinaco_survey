"use client"

import type { ServiceKpiSummary } from "@/features/dashboard/dashboard.types"
import { SkeletonKPIRow } from "@/components/dashboard/common/Skeleton"

interface KpiCardProps {
  label: string
  value: number
  max: number
  color: string
  bgColor: string
  borderColor: string
}

function KpiCard({ label, value, max, color, bgColor, borderColor }: KpiCardProps) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className={`rounded-xl border-2 ${borderColor} ${bgColor} px-4 py-3 flex flex-col gap-2`}>
      <p className="text-xs font-medium text-gray-500 leading-tight">{label}</p>
      <p className={`text-2xl font-extrabold ${color}`}>
        {value.toFixed(1)}<span className="text-base font-semibold text-gray-400">/{max}</span>
      </p>
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full transition-all`} style={{ width: `${pct}%`, background: "currentColor" }} />
      </div>
    </div>
  )
}

interface Props {
  data?: ServiceKpiSummary
  isLoading?: boolean
}

export function ServiceKPIs({ data, isLoading }: Props) {
  if (isLoading) return <SkeletonKPIRow cols={4} />
  const kpis = [
    {
      label: "Đánh giá CTKM",
      value: data?.promotion_rating ?? 0,
      max: 5,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Chất lượng bảo hành",
      value: data?.warranty_rating ?? 0,
      max: 5,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      label: "Chất lượng vận chuyển",
      value: data?.delivery_rating ?? 0,
      max: 5,
      color: "text-violet-700",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
    },
    {
      label: "Điểm trung bình so với đối thủ",
      value: data?.competitor_rating ?? 0,
      max: 3,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
  ]

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${isLoading ? "opacity-60" : ""}`}>
      {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
    </div>
  )
}

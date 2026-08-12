"use client"

import type { QCDashboardData } from "@/features/dashboard/dashboard.types"

interface Props {
  data?: QCDashboardData | null
  isLoading?: boolean
}

interface KPICardProps {
  label: string
  value: string
  sub: string
  subColor?: string
}

function KPICard({ label, value, sub, subColor }: KPICardProps) {
  return (
    <div className="bg-white border rounded-xl px-4 py-3 flex flex-col gap-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-[#1a2b5f]">{value}</p>
      <p className={`text-xs ${subColor ?? "text-gray-400"}`}>{sub}</p>
    </div>
  )
}

export function QCKPIs({ data, isLoading }: Props) {
  const total = data?.total_completed ?? 0
  const reviewed = data?.total_reviewed ?? 0
  const passed = data?.total_passed ?? 0
  const failed = data?.total_failed ?? 0
  const concluded = data?.total_concluded ?? 0
  const mismatch = data?.location_mismatch_count ?? 0

  const reviewPct = data?.review_rate_pct ?? 0
  const passPct = data?.pass_rate_pct ?? 0
  const failPct = data?.fail_rate_pct ?? 0

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${isLoading ? "opacity-60" : ""}`}>
      <KPICard
        label="Tỷ lệ kiểm tra đối chiếu"
        value={`${reviewPct}%`}
        sub={`${reviewed}/${total} khảo sát hoàn thành`}
      />
      <KPICard
        label="Tỷ lệ đạt"
        value={`${passPct}%`}
        sub={`${passed} đạt / ${concluded} QC`}
        subColor="text-emerald-600"
      />
      <KPICard
        label="Tỷ lệ không đạt"
        value={`${failPct}%`}
        sub={`${failed} không đạt / ${concluded} QC`}
        subColor="text-red-500"
      />
      <KPICard
        label="Số điểm lệch vị trí"
        value={String(mismatch)}
        sub="Tổng khảo sát cần chụp hình thứ 3"
      />
    </div>
  )
}

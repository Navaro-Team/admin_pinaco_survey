"use client"

import type { QCDashboardData } from "@/features/dashboard/dashboard.types"

// ─── SVG donut helper ─────────────────────────────────────────────────────────

const R = 70
const CX = 100
const CY = 100
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * R

function arc(pct: number) {
  const dash = (pct / 100) * CIRCUMFERENCE
  return `${dash} ${CIRCUMFERENCE}`
}

interface DonutProps {
  segments: { pct: number; color: string; label: string }[]
  centerLabel?: string
  legend: { color: string; label: string }[]
}

function DonutChart({ segments, centerLabel, legend }: DonutProps) {
  let offset = 0
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 200 200" width={180} height={180}>
        {/* Background ring */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f3f4f6" strokeWidth={STROKE} />

        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * CIRCUMFERENCE
          const rotation = -90 + (offset / 100) * 360
          offset += seg.pct
          return (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={arc(seg.pct)}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${CX} ${CY})`}
              strokeLinecap="butt"
            />
          )
        })}

        {centerLabel && (
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#374151" fontWeight="600">
            {centerLabel}
          </text>
        )}
      </svg>

      <div className="flex gap-4 flex-wrap justify-center">
        {legend.map((l, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  data?: QCDashboardData | null
  isLoading?: boolean
}

export function QCDonutCharts({ data, isLoading }: Props) {
  const passPct = data?.pass_rate_pct ?? 0
  const failPct = data?.fail_rate_pct ?? 0
  const reviewPct = data?.review_rate_pct ?? 0
  const notReviewPct = Math.max(0, Math.round((100 - reviewPct) * 10) / 10)

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 ${isLoading ? "opacity-60" : ""}`}>
      {/* Kết quả kiểm duyệt */}
      <div className="bg-white border rounded-xl px-4 py-3">
        <h3 className="text-base font-bold text-gray-800 mb-3">Kết quả kiểm duyệt</h3>
        <div className="flex justify-center">
          <DonutChart
            segments={[
              { pct: passPct, color: "#22c55e", label: "Đạt" },
              { pct: failPct, color: "#ef4444", label: "Không đạt" },
            ]}
            legend={[
              { color: "#22c55e", label: "Đạt" },
              { color: "#ef4444", label: "Không đạt" },
            ]}
          />
        </div>
      </div>

      {/* Tỷ lệ kiểm tra đối chiếu */}
      <div className="bg-white border rounded-xl px-4 py-3">
        <h3 className="text-base font-bold text-gray-800 mb-3">Tỷ lệ kiểm tra đối chiếu</h3>
        <div className="flex justify-center">
          <DonutChart
            segments={[
              { pct: reviewPct, color: "#3b5bdb", label: "Đã kiểm tra" },
              { pct: notReviewPct, color: "#dee2e6", label: "Chưa kiểm tra" },
            ]}
            legend={[
              { color: "#3b5bdb", label: "Đã kiểm tra" },
              { color: "#dee2e6", label: "Chưa kiểm tra" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

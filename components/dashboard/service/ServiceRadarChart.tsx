"use client"

import { SkeletonRadar } from "@/components/dashboard/common/Skeleton"

// 6 axes for the radar (exclude comparison criteria)
const RADAR_AXES = [
  { key: "PINACO_PROMOTION_CLARITY", label: "CTKM dễ hiểu", max: 5 },
  { key: "PINACO_PROMOTION_FREQUENCY", label: "Tần suất CTKM", max: 5 },
  { key: "PINACO_WARRANTY_CLAIM_DIFFICULTY", label: "Xác định lỗi BH", max: 5 },
  { key: "PINACO_WARRANTY_PROCESSING_SPEED", label: "Thời gian xử lý BH", max: 5 },
  { key: "PINACO_DELIVERY_COST_BURDEN", label: "Chi phí vận chuyển", max: 5 },
  { key: "PINACO_DISTRIBUTOR_DELIVERY_SATISFACTION", label: "Hài lòng vận chuyển", max: 5 },
]

const CX = 300, CY = 230, R = 130
const N = RADAR_AXES.length
const LEVELS = 5
const LABEL_OFFSET = 46

function polarToXY(angle: number, radius: number) {
  return {
    x: CX + radius * Math.sin(angle),
    y: CY - radius * Math.cos(angle),
  }
}

function polyPoints(values: number[], maxR: number) {
  return values
    .map((v, i) => {
      const angle = (2 * Math.PI * i) / N
      const r = (v / LEVELS) * maxR
      const p = polarToXY(angle, r)
      return `${p.x},${p.y}`
    })
    .join(" ")
}

interface Props {
  data?: Record<string, number>
  isLoading?: boolean
}

export function ServiceRadarChart({ data, isLoading }: Props) {
  if (isLoading) return <SkeletonRadar />
  const values = RADAR_AXES.map(a => Math.min(data?.[a.key] ?? 0, a.max))

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <h3 className="text-base font-bold text-blue-700 mb-0.5">Điểm hài lòng theo tiêu chí</h3>
      <p className="text-xs text-gray-400 mb-2">Biểu đồ radar — thang điểm 1–5</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 600 530" width="100%" style={{ maxWidth: 600 }}>
          {/* Grid levels */}
          {Array.from({ length: LEVELS }, (_, lvl) => {
            const r = (R * (lvl + 1)) / LEVELS
            const pts = Array.from({ length: N }, (_, i) => {
              const a = (2 * Math.PI * i) / N
              const p = polarToXY(a, r)
              return `${p.x},${p.y}`
            }).join(" ")
            return <polygon key={lvl} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={1} />
          })}

          {/* Axis lines */}
          {RADAR_AXES.map((_, i) => {
            const angle = (2 * Math.PI * i) / N
            const end = polarToXY(angle, R)
            return <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="#d1d5db" strokeWidth={1} />
          })}

          {/* Level labels (on first axis) */}
          {Array.from({ length: LEVELS }, (_, lvl) => {
            const r = (R * (lvl + 1)) / LEVELS
            return (
              <text key={lvl} x={CX + 4} y={CY - r + 4} fontSize={9} fill="#9ca3af">{lvl + 1}</text>
            )
          })}

          {/* Data polygon */}
          {values.some(v => v > 0) && (
            <polygon
              points={polyPoints(values, R)}
              fill="rgba(37,99,235,0.15)"
              stroke="#1d4ed8"
              strokeWidth={2}
            />
          )}

          {/* Data points */}
          {values.map((v, i) => {
            const angle = (2 * Math.PI * i) / N
            const r = (v / LEVELS) * R
            const p = polarToXY(angle, r)
            return v > 0
              ? <circle key={i} cx={p.x} cy={p.y} r={4} fill="#1d4ed8" />
              : null
          })}

          {/* Axis labels — split into max 2 lines if label has a space */}
          {RADAR_AXES.map((axis, i) => {
            const angle = (2 * Math.PI * i) / N
            const p = polarToXY(angle, R + LABEL_OFFSET)
            const anchor = p.x < CX - 10 ? "end" : p.x > CX + 10 ? "start" : "middle"
            const words = axis.label.split(" ")
            const mid = Math.ceil(words.length / 2)
            const line1 = words.slice(0, mid).join(" ")
            const line2 = words.slice(mid).join(" ")
            const lineH = 15
            const yBase = line2 ? p.y - lineH / 2 : p.y
            return (
              <text key={i} x={p.x} fontSize={12} fill="#374151" textAnchor={anchor}>
                <tspan x={p.x} y={yBase} dominantBaseline="middle">{line1}</tspan>
                {line2 && <tspan x={p.x} y={yBase + lineH} dominantBaseline="middle">{line2}</tspan>}
              </text>
            )
          })}

          {/* Legend — centered bottom */}
          <rect x={253} y={506} width={14} height={12} fill="rgba(37,99,235,0.15)" stroke="#1d4ed8" strokeWidth={1.5} />
          <text x={271} y={512} fontSize={12} fill="#374151" dominantBaseline="middle">Điểm trung bình</text>
        </svg>
      </div>
    </div>
  )
}

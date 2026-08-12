"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { SkeletonChart, SkeletonTable } from "@/components/dashboard/common/Skeleton"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getPricingTable } from "@/features/dashboard/dashboard.slice"
import type { GlobalFilterState } from "@/components/dashboard/GlobalFilter"

type SkuBoxData = {
  sku_code?: string
  sku_name: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outlier?: number
}

function fmtVND(v: number) {
  return new Intl.NumberFormat("vi-VN").format(v) + " đ"
}

// ── Pure SVG Box Plot ──────────────────────────────────────────────────────────
const MT = 30, MB = 52, ML = 96, MR = 16
const H = 300

function niceAxis(rawMax: number, tickCount = 6) {
  if (rawMax <= 0) rawMax = 1_000_000
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax / tickCount)))
  const niceSteps = [1, 2, 2.5, 5, 10]
  let step = magnitude
  for (const s of niceSteps) {
    const candidate = magnitude * s
    if (candidate * tickCount >= rawMax) { step = candidate; break }
  }
  const yMax = step * tickCount
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * step)
  return { yMax, ticks, step }
}

function fmtTick(v: number, step: number): string {
  if (v === 0) return "0"
  if (step >= 1_000_000_000 || v >= 1_000_000_000)
    return `${(v / 1_000_000_000).toFixed(v % 1_000_000_000 === 0 ? 0 : 1)} tỷ`
  if (step >= 1_000_000 || v >= 1_000_000)
    return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)} tr`
  return new Intl.NumberFormat("vi-VN").format(v)
}

function BoxPlot({ data }: { data: SkuBoxData[] }) {
  const VB_W = 560
  const slotW = (VB_W - ML - MR) / Math.max(data.length, 1)
  const chartH = H - MT - MB
  const chartW = VB_W - ML - MR

  const rawMax = Math.max(...data.flatMap(d => [d.max, d.outlier ?? 0]), 1)
  const { yMax, ticks, step } = niceAxis(rawMax)

  const toY = (v: number) => chartH - (v / yMax) * chartH

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${H}`}
      width="100%"
      height={H}
      style={{ overflow: "visible", display: "block" }}
    >
      <text x={10} y={MT - 10} fontSize={11} fill="#6b7280">Giá bán (VNĐ)</text>

      {ticks.map((v) => {
        const py = MT + toY(v)
        return (
          <g key={v}>
            <line x1={ML} x2={ML + chartW} y1={py} y2={py} stroke="#e5e7eb" strokeWidth={1} />
            <text x={ML - 6} y={py + 4} fontSize={10} fill="#9ca3af" textAnchor="end">
              {fmtTick(v, step)}
            </text>
          </g>
        )
      })}

      <line x1={ML} x2={ML} y1={MT} y2={MT + chartH} stroke="#d1d5db" />

      {data.map((d, i) => {
        const cx = ML + i * slotW + slotW / 2
        const bW = 40
        const bX = cx - bW / 2

        const yMin = MT + toY(d.min)
        const yQ1 = MT + toY(d.q1)
        const yMedian = MT + toY(d.median)
        const yQ3 = MT + toY(d.q3)
        const yMax = MT + toY(d.max)

        return (
          <g key={d.sku_name}>
            <line x1={cx} x2={cx} y1={yMax} y2={yMin} stroke="#1565C0" strokeWidth={1.5} />
            <line x1={cx - 10} x2={cx + 10} y1={yMax} y2={yMax} stroke="#1565C0" strokeWidth={1.5} />
            <line x1={cx - 10} x2={cx + 10} y1={yMin} y2={yMin} stroke="#1565C0" strokeWidth={1.5} />
            <rect x={bX} y={yQ3} width={bW} height={yQ1 - yQ3} fill="#93c5fd" stroke="#1565C0" strokeWidth={1.5} />
            <line x1={bX} x2={bX + bW} y1={yMedian} y2={yMedian} stroke="#1565C0" strokeWidth={2} />
            {d.outlier !== undefined && (
              <circle cx={cx} cy={MT + toY(d.outlier)} r={4} fill="#ef4444" />
            )}
            <text x={cx} y={MT + chartH + 18} fontSize={11} fill="#374151" textAnchor="middle">
              {d.sku_name}
            </text>
          </g>
        )
      })}

      <text x={ML + chartW / 2} y={H - 6} fontSize={11} fill="#6b7280" textAnchor="middle">
        SKU PINACO
      </text>
    </svg>
  )
}

// ──────────────────────────────────────────────────────────────────────────────

interface Props {
  boxData?: SkuBoxData[]
  filter: GlobalFilterState
  isLoading?: boolean
}

export function InternalPriceGap({ boxData, filter, isLoading: parentLoading }: Props) {
  const dispatch = useAppDispatch()
  const paged = useAppSelector(state => state.dashboard.pricingTable)
  const requestState = useAppSelector(state => state.dashboard.requestState)
  const isTableLoading = requestState.status === "loading" && requestState.type === "getPricingTable"

  if (parentLoading && !boxData) return (
    <div className="flex flex-col gap-3">
      <SkeletonChart height={280} />
      <SkeletonTable rows={5} cols={5} />
    </div>
  )

  const box = boxData ?? []
  const rows = paged?.rows ?? []
  const hasMore = paged?.pagination.hasMore ?? false
  const nextPage = (paged?.pagination.page ?? 0) + 1
  const hasSuspicious = rows.some((r) => r.status === "suspicious")

  const handleLoadMore = () => {
    dispatch(getPricingTable({ ...filter, page: nextPage, limit: 20 }))
  }

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${parentLoading ? "opacity-60" : ""}`}>
      <h3 className="text-base font-bold text-blue-700 mb-3">1. KHOẢNG LỆCH GIÁ NỘI BỘ PINACO</h3>

      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-1">
            Phân phối giá bán lẻ PINACO theo SKU (trong Khu vực)
          </p>
          {box.length === 0
            ? <div className="flex items-center justify-center h-75 text-gray-400 text-sm">Chưa có dữ liệu</div>
            : <BoxPlot data={box} />
          }
        </div>

        {hasSuspicious && (
          <div className="w-full lg:w-64 shrink-0 self-start">
            <div className="border-2 border-red-400 rounded-xl bg-red-50 px-4 py-4 flex gap-3 items-start">
              <AlertTriangle className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-600 mb-1">Nghi ngờ phá giá nội bộ</p>
                <p className="text-xs text-red-500 leading-relaxed">
                  Giá PINACO thấp hơn Mean của cùng SKU tại Khu vực trên 10%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`overflow-x-auto ${isTableLoading && rows.length === 0 ? "opacity-60" : ""}`}>
        <table className="w-full text-sm min-w-200">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left font-bold text-gray-700 px-3 py-2 rounded-tl-lg">Khu vực</th>
              <th className="text-left font-bold text-gray-700 px-3 py-2">SKU PINACO</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2">Số cửa hàng</th>
              <th className="text-right font-bold text-gray-700 px-3 py-2">Giá Min</th>
              <th className="text-right font-bold text-gray-700 px-3 py-2">Giá Mean</th>
              <th className="text-right font-bold text-gray-700 px-3 py-2">Giá Median</th>
              <th className="text-right font-bold text-gray-700 px-3 py-2">Giá Max</th>
              <th className="text-right font-bold text-gray-700 px-3 py-2">Chênh lệch</th>
              <th className="text-center font-bold text-gray-700 px-3 py-2 rounded-tr-lg">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && !isTableLoading && (
              <tr><td colSpan={9} className="text-center text-gray-400 text-sm py-8">Chưa có dữ liệu</td></tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-gray-700">{row.area_name}</td>
                <td className="px-3 py-2.5 text-gray-600">{row.sku_name}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{row.store_count}</td>
                <td className="px-3 py-2.5 text-right text-gray-600">{fmtVND(row.price_min)}</td>
                <td className="px-3 py-2.5 text-right text-gray-600">{fmtVND(row.price_mean)}</td>
                <td className="px-3 py-2.5 text-right text-gray-600">{fmtVND(row.price_median)}</td>
                <td className="px-3 py-2.5 text-right text-gray-600">{fmtVND(row.price_max)}</td>
                <td className={cn("px-3 py-2.5 text-right font-semibold", row.gap_pct > 10 ? "text-red-500" : "text-gray-500")}>
                  {row.gap_pct.toFixed(1)}%
                </td>
                <td className="px-3 py-2.5 text-center">
                  {row.status === "suspicious" ? (
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-600 border border-red-300">
                      Nghi ngờ phá giá nội bộ
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-600 border border-green-300">
                      Bình thường
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isTableLoading}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTableLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Xem thêm ({paged!.pagination.total - rows.length} còn lại)
          </button>
        </div>
      )}

      {isTableLoading && rows.length > 0 && (
        <div className="mt-2 flex justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  )
}

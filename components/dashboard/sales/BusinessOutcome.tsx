"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Combobox } from "@/components/ui/combobox"
import { Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DealerSegment } from "@/features/dashboard/dashboard.types"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getBusinessOutcome } from "@/features/dashboard/dashboard.slice"
import type { GlobalFilterState } from "@/components/dashboard/GlobalFilter"
import { useState } from "react"

const SEGMENT_LABEL: Record<DealerSegment, string> = {
  loyal: "Trung thành",
  potential: "Tiềm năng",
  dominated: "Bị chiếm lĩnh",
}

const SEGMENT_STYLE: Record<DealerSegment, string> = {
  loyal: "bg-green-100 text-green-700 border border-green-300",
  potential: "bg-yellow-50 text-yellow-700 border border-yellow-300",
  dominated: "bg-red-50 text-red-600 border border-red-300",
}

interface Props {
  filter: GlobalFilterState
}

const SEGMENT_OPTIONS = [
  { value: "", label: "Tất cả phân nhóm" },
  { value: "loyal", label: "Trung thành" },
  { value: "potential", label: "Tiềm năng" },
  { value: "dominated", label: "Bị chiếm lĩnh" },
]

export function BusinessOutcome({ filter }: Props) {
  const dispatch = useAppDispatch()
  const [segment, setSegment] = useState("")
  const paged = useAppSelector(state => state.dashboard.businessOutcome)
  const requestState = useAppSelector(state => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getBusinessOutcome"

  const rows = paged?.rows ?? []
  const hasMore = paged?.pagination.hasMore ?? false
  const nextPage = (paged?.pagination.page ?? 0) + 1

  const handleLoadMore = () => {
    dispatch(getBusinessOutcome({ ...filter, segment, page: nextPage, limit: 20 }))
  }

  const handleSegmentChange = (val: string) => {
    setSegment(val)
    dispatch(getBusinessOutcome({ ...filter, segment: val, page: 1, limit: 20 }))
  }

  const topPriority = rows.filter((d) => d.segment === "dominated").sort((a, b) => b.total_revenue_million - a.total_revenue_million)[0]

  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h3 className="text-base font-bold text-blue-700">4. BUSINESS OUTCOME — PHÂN NHÓM ĐẠI LÝ</h3>
        <Combobox
          options={SEGMENT_OPTIONS}
          value={segment}
          onChange={handleSegmentChange}
          placeholder="Tất cả phân nhóm"
          className="w-48"
        />
      </div>
      <div className={`overflow-x-auto ${isLoading && rows.length === 0 ? "opacity-60" : ""}`}>
        <Table className="text-sm min-w-175">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">Đại lý</TableHead>
              <TableHead className="font-bold text-gray-700">Khu vực</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">Tổng DS/tháng (Triệu VNĐ)</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">SOW PINACO (%)</TableHead>
              <TableHead className="font-bold text-gray-700">Phân nhóm</TableHead>
              <TableHead className="font-bold text-gray-700">Đối thủ chính</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-8 text-sm">Chưa có dữ liệu</TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.dealer_id}>
                  <TableCell className="font-medium text-gray-700">{row.dealer_name}</TableCell>
                  <TableCell className="text-gray-500">{row.region}</TableCell>
                  <TableCell className="text-right font-medium">{row.total_revenue_million.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{row.sow_pinaco_pct}%</TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", SEGMENT_STYLE[row.segment])}>
                      {SEGMENT_LABEL[row.segment]}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {row.main_competitor} · {row.competitor_share_pct}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Xem thêm ({paged!.pagination.total - rows.length} còn lại)
          </button>
        </div>
      )}

      {isLoading && rows.length > 0 && (
        <div className="mt-2 flex justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        </div>
      )}

      {topPriority && (
        <div className="mt-1.5 flex items-start gap-1.5 bg-blue-50 rounded-lg px-2 py-1.5 text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Ưu tiên Sales: xử lý trước đại lý Bị chiếm lĩnh có Tổng doanh số lớn nhất.</span>
        </div>
      )}
    </div>
  )
}

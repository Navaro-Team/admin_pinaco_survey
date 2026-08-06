"use client"

import { AlertTriangle, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AlertLevel } from "@/features/dashboard/dashboard.types"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { getInventoryHealth } from "@/features/dashboard/dashboard.slice"
import type { GlobalFilterState } from "@/components/dashboard/GlobalFilter"

const ALERT_CONFIG: Record<AlertLevel, { className: string; Icon: React.ElementType }> = {
  danger:  { className: "bg-red-500 text-white",    Icon: AlertTriangle },
  warning: { className: "bg-orange-400 text-white", Icon: AlertTriangle },
  info:    { className: "bg-gray-400 text-white",   Icon: Circle        },
}

function AlertBadge({ level, label }: { level: AlertLevel; label: string }) {
  const { className, Icon } = ALERT_CONFIG[level]
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold", className)}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </span>
  )
}

function fmtPct(v: number) {
  return `${v.toFixed(1)}%`
}

interface Props {
  filter: GlobalFilterState
}

export function InventoryHealth({ filter }: Props) {
  const dispatch = useAppDispatch()
  const paged = useAppSelector(state => state.dashboard.inventoryHealth)
  const requestState = useAppSelector(state => state.dashboard.requestState)
  const isLoading = requestState.status === "loading" && requestState.type === "getInventoryHealth"

  const rows = paged?.rows ?? []
  const hasMore = paged?.pagination.hasMore ?? false
  const nextPage = (paged?.pagination.page ?? 0) + 1

  const handleLoadMore = () => {
    dispatch(getInventoryHealth({ ...filter, page: nextPage, limit: 20 }))
  }

  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">4. INVENTORY HEALTH — SỨC KHOẺ KHO HÀNG</h3>
      <div className={`overflow-x-auto ${isLoading && rows.length === 0 ? "opacity-60" : ""}`}>
        <Table className="text-sm min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-blue-700">Cửa hàng</TableHead>
              <TableHead className="font-bold text-blue-700">Khu vực</TableHead>
              <TableHead className="font-bold text-blue-700 text-right">SOW PINACO</TableHead>
              <TableHead className="font-bold text-blue-700 text-right">Inventory Share PINACO</TableHead>
              <TableHead className="font-bold text-blue-700">Cảnh báo</TableHead>
              <TableHead className="font-bold text-blue-700">Hành động đề xuất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-8 text-sm">Chưa có dữ liệu</TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.store_id}>
                  <TableCell className="font-medium text-gray-700">{row.store_name}</TableCell>
                  <TableCell className="text-gray-500">{row.region}</TableCell>
                  <TableCell className="text-right font-medium">{fmtPct(row.sow_pinaco_pct)}</TableCell>
                  <TableCell className="text-right font-medium">{fmtPct(row.inventory_share_pct)}</TableCell>
                  <TableCell>
                    <AlertBadge level={row.alert_level} label={row.alert_label} />
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs">{row.suggested_action}</TableCell>
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
    </div>
  )
}

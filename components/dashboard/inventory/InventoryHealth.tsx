"use client"

import { AlertTriangle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AlertLevel = "danger" | "warning" | "info"

type StoreRow = {
  store: string
  district: string
  sowWeeks: number
  inventoryShare: number
  alert: AlertLevel
  alertLabel: string
  action: string
}

const DATA: StoreRow[] = [
  {
    store: "Cửa hàng Hoàng Phát",
    district: "Tràng Bàng",
    sowWeeks: 2.1,
    inventoryShare: 12,
    alert: "danger",
    alertLabel: "Nguy cơ đứt hàng",
    action: "ASM giục NPP giao hàng",
  },
  {
    store: "Cửa hàng Minh Tâm",
    district: "Gò Dầu",
    sowWeeks: 6.8,
    inventoryShare: 34,
    alert: "warning",
    alertLabel: "Nguy cơ đọng vốn",
    action: "Tung Sell-out",
  },
  {
    store: "Cửa hàng Phú An",
    district: "Hòa Thành",
    sowWeeks: 3.0,
    inventoryShare: 11,
    alert: "info",
    alertLabel: "Đối thủ áp đảo",
    action: "Báo Trade Marketing",
  },
]

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

export function InventoryHealth() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">4. INVENTORY HEALTH — SỨC KHOẺ KHO HÀNG</h3>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-blue-700">Cửa hàng</TableHead>
              <TableHead className="font-bold text-blue-700">Huyện/Thị xã</TableHead>
              <TableHead className="font-bold text-blue-700 text-right">SOW PINACO</TableHead>
              <TableHead className="font-bold text-blue-700 text-right">Inventory Share PINACO</TableHead>
              <TableHead className="font-bold text-blue-700">Cảnh báo</TableHead>
              <TableHead className="font-bold text-blue-700">Hành động đề xuất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DATA.map((row) => (
              <TableRow key={row.store}>
                <TableCell className="font-medium text-gray-700">{row.store}</TableCell>
                <TableCell className="text-gray-500">{row.district}</TableCell>
                <TableCell className="text-right font-medium">{row.sowWeeks} tuần</TableCell>
                <TableCell className="text-right font-medium">{row.inventoryShare}%</TableCell>
                <TableCell>
                  <AlertBadge level={row.alert} label={row.alertLabel} />
                </TableCell>
                <TableCell className="text-gray-600">{row.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

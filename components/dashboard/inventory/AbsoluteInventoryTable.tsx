"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RegionBrandRow, StatEntry } from "@/features/dashboard/dashboard.types"

const BRAND_COLS = [
  { key: "pinaco",     label: "PINACO"     },
  { key: "gs",         label: "GS"         },
  { key: "enimac",     label: "Enimac"     },
  { key: "globe",      label: "Globe"      },
  { key: "thien_nang", label: "Thiên Năng" },
  { key: "yamato",     label: "Yamato"     },
  { key: "xupai",      label: "Xupai"      },
  { key: "cuu_hoi",    label: "Cứu Hội"   },
  { key: "khac",       label: "Khác"       },
] as const

function StatCell({ entry }: { entry: StatEntry | undefined }) {
  if (!entry) return <TableCell className="text-xs text-gray-400 py-1.5 whitespace-nowrap">—</TableCell>
  return (
    <TableCell className="text-xs align-top py-1.5 whitespace-nowrap">
      <div className="flex flex-col gap-0.5">
        <span><span className="text-gray-400">Mean: </span><span className="font-medium">{entry.mean.toLocaleString("vi-VN")} tr</span></span>
        <span><span className="text-gray-400">Mode: </span><span className="font-medium">{entry.mode.toLocaleString("vi-VN")} tr</span></span>
        <span className="text-gray-400">Min {entry.min.toLocaleString("vi-VN")} – Max {entry.max.toLocaleString("vi-VN")} tr</span>
      </div>
    </TableCell>
  )
}

interface Props {
  data?: RegionBrandRow[]
  isLoading?: boolean
}

export function AbsoluteInventoryTable({ data, isLoading }: Props) {
  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">1. BỨC TRANH TỒN KHO TUYỆT ĐỐI</h3>
        <span className="text-xs text-gray-400 italic">Triệu VNĐ / cửa hàng</span>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">Khu vực</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Số mẫu (N)</TableHead>
              <TableHead className="font-bold text-gray-700">Tổng tồn kho / cửa hàng</TableHead>
              {BRAND_COLS.map((c) => (
                <TableHead key={c.key} className="font-bold text-gray-700">{c.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={BRAND_COLS.length + 3} className="text-center text-gray-400 py-8 text-sm">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.region_id} className="align-top">
                  <TableCell className="font-semibold text-gray-700 py-1.5 align-middle">{row.region_name}</TableCell>
                  <TableCell className="text-center align-middle font-medium">{row.sample_count}</TableCell>
                  <StatCell entry={row.total} />
                  {BRAND_COLS.map((c) => (
                    <StatCell key={c.key} entry={row.brands[c.key]} />
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

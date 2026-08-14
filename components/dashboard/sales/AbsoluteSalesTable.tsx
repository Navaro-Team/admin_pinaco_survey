"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RegionBrandRow, StatEntry } from "@/features/dashboard/dashboard.types"
import { SkeletonTable } from "@/components/dashboard/common/Skeleton"

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
  if (!entry) return <TableCell className="text-xs text-gray-400 py-1.5">—</TableCell>
  return (
    <TableCell className="text-xs align-top py-1.5">
      <div className="flex flex-col gap-0.5">
        <span><span className="text-gray-400">Mean</span> <span className="font-medium">{entry.mean.toLocaleString("vi-VN")}</span></span>
        <span><span className="text-gray-400">Mode</span> <span className="font-medium">{entry.mode.toLocaleString("vi-VN")}</span></span>
        <span className="text-gray-400">Min {entry.min.toLocaleString("vi-VN")} – Max {entry.max.toLocaleString("vi-VN")}</span>
      </div>
    </TableCell>
  )
}

interface Props {
  data?: RegionBrandRow[]
  isLoading?: boolean
  groupBy?: 'region' | 'province'
}

export function AbsoluteSalesTable({ data, isLoading, groupBy = 'region' }: Props) {
  if (isLoading) return <SkeletonTable rows={4} cols={6} />
  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">1. BỨC TRANH DOANH SỐ TUYỆT ĐỐI</h3>
        <span className="text-xs text-gray-400 italic">Triệu VNĐ / cửa hàng / tháng</span>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-225">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">{groupBy === 'province' ? 'Tỉnh thành' : 'Khu vực'}</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">N</TableHead>
              <TableHead className="font-bold text-gray-700">Tổng DS/Cửa hàng</TableHead>
              {BRAND_COLS.map((col) => (
                <TableHead key={col.key} className="font-bold text-gray-700">{col.label}</TableHead>
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
                  <TableCell className="text-center align-middle font-medium">{row.sample_count.toLocaleString()}</TableCell>
                  <StatCell entry={row.total} />
                  {BRAND_COLS.map((col) => (
                    <StatCell key={col.key} entry={row.brands[col.key]} />
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

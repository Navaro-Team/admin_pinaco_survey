"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SkeletonTable } from "@/components/dashboard/common/Skeleton"

type StatEntry = { mean: number; mode: number; min: number; max: number }

type AreaRow = {
  area_name: string
  sample_count: number
  brands: Record<string, StatEntry>
}


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

function StatCell({ entry }: { entry: StatEntry }) {
  return (
    <TableCell className="text-xs align-top py-2 whitespace-nowrap">
      <div className="flex flex-col gap-0.5">
        <span>
          <span className="text-gray-400">Mean: </span>
          <span className="font-medium">{entry.mean.toFixed(1)}/10</span>
        </span>
        <span>
          <span className="text-gray-400">Mode: </span>
          <span className="font-medium">{entry.mode}</span>
        </span>
        <span className="text-gray-400">Min–Max: {entry.min}–{entry.max}</span>
      </div>
    </TableCell>
  )
}

interface Props {
  data?: AreaRow[]
  isLoading?: boolean
}

export function AbsoluteVolumeTable({ data, isLoading }: Props) {
  if (isLoading) return <SkeletonTable rows={4} cols={5} />
  const rows = data ?? []

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">1. BỨC TRANH SẢN LƯỢNG TUYỆT ĐỐI — TRÊN HỆ QUY CHIẾU 10 BÌNH</h3>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">Khu vực</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Số mẫu (N)</TableHead>
              {BRAND_COLS.map((c) => (
                <TableHead key={c.key} className="font-bold text-gray-700">{c.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={BRAND_COLS.length + 2} className="text-center text-gray-400 text-sm py-8">Chưa có dữ liệu</TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.area_name} className="align-top">
                <TableCell className="font-semibold text-gray-700 py-2 align-middle">{row.area_name}</TableCell>
                <TableCell className="text-center align-middle font-medium">{row.sample_count}</TableCell>
                {BRAND_COLS.map((c) => (
                  <StatCell key={c.key} entry={row.brands[c.key] ?? { mean: 0, mode: 0, min: 0, max: 0 }} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

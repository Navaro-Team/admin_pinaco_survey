"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type RegionRow = {
  region: string
  n: number
  totalDS: { mean: number; mode: number; minMax: string }
  pinaco: { mean: number; mode: number; minMax: string }
  gs: { mean: number; mode: number; minMax: string }
  enimac: { mean: number; mode: number; minMax: string }
  globe: { mean: number; mode: number; minMax: string }
  thienNang: { mean: number; mode: number; minMax: string }
  yamato: { mean: number; mode: number; minMax: string }
  xupai: { mean: number; mode: number; minMax: string }
  cuuHoi: { mean: number; mode: number; minMax: string }
  khac: { mean: number; mode: number; minMax: string }
}

const DATA: RegionRow[] = [
  {
    region: "Miền Nam", n: 1025,
    totalDS: { mean: 312.4, mode: 280.0, minMax: "28–1,850" },
    pinaco: { mean: 106.2, mode: 95.0, minMax: "8–720" },
    gs: { mean: 74.9, mode: 65.0, minMax: "6–480" },
    enimac: { mean: 34.1, mode: 30.0, minMax: "4–260" },
    globe: { mean: 22.1, mode: 20.0, minMax: "2–180" },
    thienNang: { mean: 24.0, mode: 20.0, minMax: "3–200" },
    yamato: { mean: 15.3, mode: 12.0, minMax: "1–120" },
    xupai: { mean: 12.4, mode: 10.0, minMax: "1–100" },
    cuuHoi: { mean: 8.3, mode: 7.0, minMax: "1–70" },
    khac: { mean: 15.1, mode: 12.0, minMax: "1–110" },
  },
  {
    region: "Miền Đông", n: 620,
    totalDS: { mean: 298.7, mode: 260.0, minMax: "25–1,620" },
    pinaco: { mean: 101.7, mode: 90.0, minMax: "7–650" },
    gs: { mean: 71.8, mode: 60.0, minMax: "5–420" },
    enimac: { mean: 33.2, mode: 28.0, minMax: "4–230" },
    globe: { mean: 21.5, mode: 18.0, minMax: "2–160" },
    thienNang: { mean: 23.5, mode: 20.0, minMax: "3–190" },
    yamato: { mean: 15.0, mode: 12.0, minMax: "1–110" },
    xupai: { mean: 11.8, mode: 10.0, minMax: "1–90" },
    cuuHoi: { mean: 8.0, mode: 7.0, minMax: "1–60" },
    khac: { mean: 11.2, mode: 10.0, minMax: "1–90" },
  },
  {
    region: "Miền Tây", n: 780,
    totalDS: { mean: 270.6, mode: 240.0, minMax: "22–1,480" },
    pinaco: { mean: 89.6, mode: 80.0, minMax: "6–600" },
    gs: { mean: 64.2, mode: 55.0, minMax: "5–380" },
    enimac: { mean: 30.8, mode: 25.0, minMax: "3–210" },
    globe: { mean: 19.6, mode: 18.0, minMax: "2–150" },
    thienNang: { mean: 21.0, mode: 18.0, minMax: "2–170" },
    yamato: { mean: 13.2, mode: 10.0, minMax: "1–100" },
    xupai: { mean: 10.5, mode: 9.0, minMax: "1–80" },
    cuuHoi: { mean: 7.2, mode: 6.0, minMax: "1–50" },
    khac: { mean: 14.5, mode: 12.0, minMax: "1–100" },
  },
]

const BRAND_COLS = [
  { key: "pinaco", label: "PINACO" },
  { key: "gs", label: "GS" },
  { key: "enimac", label: "Enimac" },
  { key: "globe", label: "Globe" },
  { key: "thienNang", label: "Thiên Năng" },
  { key: "yamato", label: "Yamato" },
  { key: "xupai", label: "Xupai" },
  { key: "cuuHoi", label: "Cứu Hội" },
  { key: "khac", label: "Khác" },
] as const

function StatCell({ data }: { data: { mean: number; mode: number; minMax: string } }) {
  return (
    <TableCell className="text-xs align-top py-1.5">
      <div className="flex flex-col gap-0.5">
        <span><span className="text-gray-400">Mean</span> <span className="font-medium">{data.mean}</span></span>
        <span><span className="text-gray-400">Mode</span> <span className="font-medium">{data.mode}</span></span>
        <span className="text-gray-400">Min-Max {data.minMax}</span>
      </div>
    </TableCell>
  )
}

export function AbsoluteSalesTable() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">1. BỨC TRANH DOANH SỐ TUYỆT ĐỐI</h3>
        <span className="text-xs text-gray-400 italic">Triệu VNĐ / cửa hàng / tháng</span>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">Khu vực</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">N</TableHead>
              <TableHead className="font-bold text-gray-700">Tổng DS/Cửa hàng</TableHead>
              {BRAND_COLS.map((col) => (
                <TableHead key={col.key} className="font-bold text-gray-700">{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {DATA.map((row) => (
              <TableRow key={row.region} className="align-top">
                <TableCell className="font-semibold text-gray-700 py-1.5 align-middle">{row.region}</TableCell>
                <TableCell className="text-center align-middle font-medium">{row.n.toLocaleString()}</TableCell>
                <StatCell data={row.totalDS} />
                {BRAND_COLS.map((col) => (
                  <StatCell key={col.key} data={row[col.key]} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type StatEntry = { mean: number; mode: number; minMax: string }

type RegionRow = {
  region: string
  n: number
  total: StatEntry
  pinaco: StatEntry
  gs: StatEntry
  enimac: StatEntry
  globe: StatEntry
  thienNang: StatEntry
  yamato: StatEntry
  khac: StatEntry
}

const DATA: RegionRow[] = [
  {
    region: "Miền Nam", n: 1025,
    total:    { mean: 48.2, mode: 40.0, minMax: "4–280" },
    pinaco:   { mean: 16.8, mode: 14.0, minMax: "1–120" },
    gs:       { mean: 11.6, mode: 10.0, minMax: "1–80"  },
    enimac:   { mean: 5.2,  mode: 4.0,  minMax: "0–40"  },
    globe:    { mean: 3.4,  mode: 3.0,  minMax: "0–28"  },
    thienNang:{ mean: 3.7,  mode: 3.0,  minMax: "0–30"  },
    yamato:   { mean: 2.3,  mode: 2.0,  minMax: "0–18"  },
    khac:     { mean: 5.2,  mode: 4.0,  minMax: "0–35"  },
  },
  {
    region: "Miền Đông", n: 620,
    total:    { mean: 44.6, mode: 38.0, minMax: "3–240" },
    pinaco:   { mean: 15.6, mode: 13.0, minMax: "1–105" },
    gs:       { mean: 10.8, mode: 9.0,  minMax: "1–72"  },
    enimac:   { mean: 4.8,  mode: 4.0,  minMax: "0–36"  },
    globe:    { mean: 3.1,  mode: 3.0,  minMax: "0–24"  },
    thienNang:{ mean: 3.4,  mode: 3.0,  minMax: "0–27"  },
    yamato:   { mean: 2.1,  mode: 2.0,  minMax: "0–16"  },
    khac:     { mean: 4.8,  mode: 4.0,  minMax: "0–32"  },
  },
  {
    region: "Miền Tây", n: 780,
    total:    { mean: 40.1, mode: 34.0, minMax: "3–210" },
    pinaco:   { mean: 13.8, mode: 12.0, minMax: "1–92"  },
    gs:       { mean: 9.6,  mode: 8.0,  minMax: "1–64"  },
    enimac:   { mean: 4.3,  mode: 3.0,  minMax: "0–32"  },
    globe:    { mean: 2.8,  mode: 2.0,  minMax: "0–20"  },
    thienNang:{ mean: 3.0,  mode: 2.0,  minMax: "0–24"  },
    yamato:   { mean: 1.9,  mode: 1.0,  minMax: "0–14"  },
    khac:     { mean: 4.7,  mode: 4.0,  minMax: "0–28"  },
  },
]

const BRAND_COLS = [
  { key: "pinaco",    label: "PINACO"     },
  { key: "gs",        label: "GS"         },
  { key: "enimac",    label: "Enimac"     },
  { key: "globe",     label: "Globe"      },
  { key: "thienNang", label: "Thiên Năng" },
  { key: "yamato",    label: "Yamato"     },
  { key: "khac",      label: "Khác"       },
] as const

function StatCell({ data }: { data: StatEntry }) {
  return (
    <TableCell className="text-xs align-top py-1.5 whitespace-nowrap">
      <div className="flex flex-col gap-0.5">
        <span><span className="text-gray-400">Mean </span><span className="font-medium">{data.mean}</span></span>
        <span><span className="text-gray-400">Mode </span><span className="font-medium">{data.mode}</span></span>
        <span className="text-gray-400">Min–Max {data.minMax}</span>
      </div>
    </TableCell>
  )
}

export function AbsoluteVolumeTable() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">1. BỨC TRANH SẢN LƯỢNG TUYỆT ĐỐI</h3>
        <span className="text-xs text-gray-400 italic">Bình / cửa hàng / tháng</span>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-[860px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">Khu vực</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">N</TableHead>
              <TableHead className="font-bold text-gray-700">Tổng sản lượng</TableHead>
              {BRAND_COLS.map((c) => (
                <TableHead key={c.key} className="font-bold text-gray-700">{c.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {DATA.map((row) => (
              <TableRow key={row.region} className="align-top">
                <TableCell className="font-semibold text-gray-700 py-1.5 align-middle">{row.region}</TableCell>
                <TableCell className="text-center align-middle font-medium">{row.n.toLocaleString()}</TableCell>
                <StatCell data={row.total} />
                {BRAND_COLS.map((c) => (
                  <StatCell key={c.key} data={row[c.key]} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

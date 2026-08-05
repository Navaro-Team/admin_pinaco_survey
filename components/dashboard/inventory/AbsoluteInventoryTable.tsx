"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  xupai: StatEntry
  cuuHoi: StatEntry
  khac: StatEntry
}

const DATA: RegionRow[] = [
  {
    region: "Khu vực 01", n: 312,
    total:    { mean: 162.7, mode: 120.0, minMax: "28–740 tr" },
    pinaco:   { mean: 54.6,  mode: 40.0,  minMax: "8–220 tr"  },
    gs:       { mean: 38.5,  mode: 30.0,  minMax: "5–180 tr"  },
    enimac:   { mean: 21.4,  mode: 18.0,  minMax: "3–95 tr"   },
    globe:    { mean: 16.8,  mode: 15.0,  minMax: "2–70 tr"   },
    thienNang:{ mean: 11.7,  mode: 10.0,  minMax: "2–55 tr"   },
    yamato:   { mean: 8.2,   mode: 7.0,   minMax: "1–40 tr"   },
    xupai:    { mean: 6.6,   mode: 5.0,   minMax: "1–30 tr"   },
    cuuHoi:   { mean: 2.9,   mode: 2.0,   minMax: "0–18 tr"   },
    khac:     { mean: 1.9,   mode: 1.0,   minMax: "0–12 tr"   },
  },
  {
    region: "Khu vực 02", n: 298,
    total:    { mean: 148.3, mode: 110.0, minMax: "25–680 tr" },
    pinaco:   { mean: 49.2,  mode: 36.0,  minMax: "7–210 tr"  },
    gs:       { mean: 35.1,  mode: 28.0,  minMax: "4–160 tr"  },
    enimac:   { mean: 19.6,  mode: 16.0,  minMax: "3–90 tr"   },
    globe:    { mean: 15.2,  mode: 13.0,  minMax: "2–65 tr"   },
    thienNang:{ mean: 10.3,  mode: 9.0,   minMax: "2–50 tr"   },
    yamato:   { mean: 7.4,   mode: 6.0,   minMax: "1–35 tr"   },
    xupai:    { mean: 5.9,   mode: 5.0,   minMax: "1–28 tr"   },
    cuuHoi:   { mean: 2.6,   mode: 2.0,   minMax: "0–16 tr"   },
    khac:     { mean: 1.6,   mode: 1.0,   minMax: "0–10 tr"   },
  },
  {
    region: "Khu vực 03", n: 276,
    total:    { mean: 134.9, mode: 100.0, minMax: "20–620 tr" },
    pinaco:   { mean: 44.7,  mode: 34.0,  minMax: "6–190 tr"  },
    gs:       { mean: 32.1,  mode: 26.0,  minMax: "4–150 tr"  },
    enimac:   { mean: 17.8,  mode: 14.0,  minMax: "2–80 tr"   },
    globe:    { mean: 13.6,  mode: 12.0,  minMax: "2–60 tr"   },
    thienNang:{ mean: 9.3,   mode: 8.0,   minMax: "1–45 tr"   },
    yamato:   { mean: 6.6,   mode: 5.0,   minMax: "1–30 tr"   },
    xupai:    { mean: 5.1,   mode: 4.0,   minMax: "1–25 tr"   },
    cuuHoi:   { mean: 2.3,   mode: 2.0,   minMax: "0–15 tr"   },
    khac:     { mean: 1.3,   mode: 1.0,   minMax: "0–8 tr"    },
  },
]

const BRAND_COLS = [
  { key: "pinaco",    label: "PINACO"     },
  { key: "gs",        label: "GS"         },
  { key: "enimac",    label: "Enimac"     },
  { key: "globe",     label: "Globe"      },
  { key: "thienNang", label: "Thiên Năng" },
  { key: "yamato",    label: "Yamato"     },
  { key: "xupai",     label: "Xupai"      },
  { key: "cuuHoi",    label: "Cứu Hội"   },
  { key: "khac",      label: "Khác"       },
] as const

function StatCell({ data }: { data: StatEntry }) {
  return (
    <TableCell className="text-xs align-top py-1.5 whitespace-nowrap">
      <div className="flex flex-col gap-0.5">
        <span>
          <span className="text-gray-400">Mean: </span>
          <span className="font-medium">{data.mean} tr</span>
        </span>
        <span>
          <span className="text-gray-400">Mode: </span>
          <span className="font-medium">{data.mode} tr</span>
        </span>
        <span className="text-gray-400">Min–Max {data.minMax}</span>
      </div>
    </TableCell>
  )
}

export function AbsoluteInventoryTable() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
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
            {DATA.map((row) => (
              <TableRow key={row.region} className="align-top">
                <TableCell className="font-semibold text-gray-700 py-1.5 align-middle">{row.region}</TableCell>
                <TableCell className="text-center align-middle font-medium">{row.n}</TableCell>
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

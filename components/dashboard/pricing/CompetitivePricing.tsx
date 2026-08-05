"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const BRAND_COLORS: Record<string, string> = {
  PINACO:     "#1565C0",
  GS:         "#FDD835",
  Enimac:     "#E91E63",
  Globe:      "#9C27B0",
  "Thiên Năng":"#4CAF50",
}

// Price index per SKU segment (100 = market average)
const PRICE_INDEX_DATA = [
  { segment: "4Ah",  PINACO: 102, GS: 98,  Enimac: 94, Globe: 90, "Thiên Năng": 88 },
  { segment: "7Ah",  PINACO: 105, GS: 100, Enimac: 96, Globe: 92, "Thiên Năng": 90 },
  { segment: "10Ah", PINACO: 108, GS: 103, Enimac: 98, Globe: 94, "Thiên Năng": 91 },
  { segment: "14Ah", PINACO: 110, GS: 104, Enimac: 99, Globe: 95, "Thiên Năng": 92 },
  { segment: "18Ah", PINACO: 112, GS: 106, Enimac: 101,Globe: 97, "Thiên Năng": 93 },
  { segment: "24Ah", PINACO: 115, GS: 108, Enimac: 103,Globe: 99, "Thiên Năng": 94 },
]

type Position = "Cao hơn" | "Tương đương" | "Thấp hơn"

const COMPETITIVE_TABLE: {
  brand: string
  avgPrice: number
  vsMarket: number
  vsPinaco: number
  position: Position
}[] = [
  { brand: "PINACO",     avgPrice: 560, vsMarket: 8,   vsPinaco: 0,   position: "Cao hơn"     },
  { brand: "GS",         avgPrice: 520, vsMarket: 2,   vsPinaco: -7,  position: "Tương đương"  },
  { brand: "Enimac",     avgPrice: 490, vsMarket: -4,  vsPinaco: -13, position: "Thấp hơn"    },
  { brand: "Globe",      avgPrice: 460, vsMarket: -10, vsPinaco: -18, position: "Thấp hơn"    },
  { brand: "Thiên Năng", avgPrice: 440, vsMarket: -14, vsPinaco: -21, position: "Thấp hơn"    },
]

const POSITION_STYLE: Record<Position, string> = {
  "Cao hơn":      "text-blue-600 font-semibold",
  "Tương đương":  "text-yellow-600 font-semibold",
  "Thấp hơn":     "text-gray-400 font-semibold",
}

const BRANDS = Object.keys(BRAND_COLORS)

export function CompetitivePricing() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">2. TƯƠNG QUAN CẠNH TRANH</h3>
        <span className="text-xs text-gray-400 italic">Chỉ số giá = 100 là mức trung bình thị trường</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Price index line chart */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Chỉ số giá tương đối theo phân khúc Ah</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PRICE_INDEX_DATA} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="segment" tick={{ fontSize: 11 }} />
              <YAxis domain={[80, 120]} tick={{ fontSize: 11 }} unit="" />
              <ReferenceLine y={100} stroke="#9ca3af" strokeDasharray="4 4" label={{ value: "Trung bình", position: "right", fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip formatter={(v: number) => `${v} điểm`} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />
              {BRANDS.map((brand) => (
                <Line
                  key={brand}
                  type="monotone"
                  dataKey={brand}
                  stroke={BRAND_COLORS[brand]}
                  strokeWidth={brand === "PINACO" ? 2.5 : 1.5}
                  dot={{ r: brand === "PINACO" ? 4 : 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Competitive table */}
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-bold text-gray-700">Thương hiệu</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Giá TB (k)</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">vs Thị trường</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">vs PINACO</TableHead>
                <TableHead className="font-bold text-gray-700">Vị thế</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPETITIVE_TABLE.map((row) => (
                <TableRow key={row.brand}>
                  <TableCell className="font-medium text-gray-700 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: BRAND_COLORS[row.brand] ?? "#9ca3af" }}
                    />
                    {row.brand}
                  </TableCell>
                  <TableCell className="text-right">{row.avgPrice}</TableCell>
                  <TableCell className={cn("text-right", row.vsMarket > 0 ? "text-blue-600" : row.vsMarket < 0 ? "text-red-500" : "text-gray-500")}>
                    {row.vsMarket > 0 ? "+" : ""}{row.vsMarket}%
                  </TableCell>
                  <TableCell className={cn("text-right", row.vsPinaco === 0 ? "text-gray-400" : "text-red-500")}>
                    {row.vsPinaco === 0 ? "—" : `${row.vsPinaco}%`}
                  </TableCell>
                  <TableCell className={cn("text-xs", POSITION_STYLE[row.position])}>{row.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

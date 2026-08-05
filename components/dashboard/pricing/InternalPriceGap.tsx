"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, LabelList, Legend,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const SKU_DATA = [
  { sku: "PINACO 4Ah",  minPrice: 280, maxPrice: 320, midPrice: 300, gap: 40  },
  { sku: "PINACO 7Ah",  minPrice: 380, maxPrice: 430, midPrice: 405, gap: 50  },
  { sku: "PINACO 10Ah", minPrice: 520, maxPrice: 600, midPrice: 560, gap: 80  },
  { sku: "PINACO 14Ah", minPrice: 680, maxPrice: 790, midPrice: 735, gap: 110 },
  { sku: "PINACO 18Ah", minPrice: 820, maxPrice: 960, midPrice: 890, gap: 140 },
  { sku: "PINACO 24Ah", minPrice: 980, maxPrice: 1150,midPrice: 1065,gap: 170 },
]

type RiskLevel = "Thấp" | "Trung bình" | "Cao"

const RISK_STYLE: Record<RiskLevel, string> = {
  "Thấp":      "text-green-600 font-semibold",
  "Trung bình":"text-yellow-600 font-semibold",
  "Cao":       "text-red-500 font-semibold",
}

function getRisk(gap: number): RiskLevel {
  if (gap < 50) return "Thấp"
  if (gap < 100) return "Trung bình"
  return "Cao"
}

export function InternalPriceGap() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-blue-700">1. KHOẢNG LỆCH GIÁ NỘI BỘ PINACO</h3>
        <span className="text-xs text-gray-400 italic">Nghìn VNĐ / bình</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Range bar chart */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Min – Max giá bán lẻ theo SKU</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={SKU_DATA}
              layout="vertical"
              margin={{ top: 4, right: 40, left: 4, bottom: 4 }}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="k" domain={[200, 1200]} />
              <YAxis type="category" dataKey="sku" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(v: number) => `${v}k VNĐ`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="minPrice" name="Giá min" fill="#93c5fd" stackId="range" radius={[3, 0, 0, 3]} />
              <Bar dataKey="gap" name="Khoảng lệch" fill="#1565C0" stackId="range" radius={[0, 3, 3, 0]}>
                <LabelList dataKey="gap" position="right" style={{ fontSize: 10, fill: "#374151" }} formatter={(v: number) => `Δ${v}k`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-bold text-gray-700">SKU</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Min (k)</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Max (k)</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Δ Lệch</TableHead>
                <TableHead className="font-bold text-gray-700">Rủi ro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SKU_DATA.map((row) => {
                const risk = getRisk(row.gap)
                return (
                  <TableRow key={row.sku}>
                    <TableCell className="font-medium text-gray-700">{row.sku}</TableCell>
                    <TableCell className="text-right text-gray-500">{row.minPrice}</TableCell>
                    <TableCell className="text-right text-gray-500">{row.maxPrice}</TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">{row.gap}k</TableCell>
                    <TableCell className={cn("text-xs", RISK_STYLE[risk])}>{risk}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const CHANNEL_COLORS: Record<string, string> = {
  "Chuyên AQ ô tô": "#1565C0",
  "Gara ô tô":       "#42A5F5",
  "Xe máy":          "#4CAF50",
  "Đại lý tổng hợp": "#FDD835",
  "Siêu thị / CH":   "#E91E63",
}

const SUMMARY = [
  { channel: "Chuyên AQ ô tô",  stores: 412, pct: 33, sow: 41, avgRevenue: 186 },
  { channel: "Gara ô tô",       stores: 298, pct: 24, sow: 35, avgRevenue: 142 },
  { channel: "Xe máy",          stores: 310, pct: 25, sow: 28, avgRevenue: 98  },
  { channel: "Đại lý tổng hợp", stores: 176, pct: 14, sow: 22, avgRevenue: 215 },
  { channel: "Siêu thị / CH",   stores: 52,  pct: 4,  sow: 18, avgRevenue: 320 },
]

const CHART_DATA = SUMMARY.map((r) => ({ name: r.channel, "SOW PINACO (%)": r.sow, "Tỷ lệ cửa hàng (%)": r.pct }))

export function DistributionStats() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">1. THỐNG KÊ KÊNH PHÂN PHỐI</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-bold text-gray-700">Kênh</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Cửa hàng</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Tỷ lệ</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">SOW PINACO</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">DS TB (tr)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUMMARY.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell className="font-medium text-gray-700 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: CHANNEL_COLORS[row.channel] }}
                    />
                    {row.channel}
                  </TableCell>
                  <TableCell className="text-right">{row.stores.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.pct}%</TableCell>
                  <TableCell className="text-right font-semibold text-blue-600">{row.sow}%</TableCell>
                  <TableCell className="text-right">{row.avgRevenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
            <YAxis tick={{ fontSize: 11 }} unit="%" />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Tỷ lệ cửa hàng (%)" fill="#42A5F5" radius={[3, 3, 0, 0]} />
            <Bar dataKey="SOW PINACO (%)" radius={[3, 3, 0, 0]}>
              {CHART_DATA.map((entry) => (
                <Cell key={entry.name} fill={CHANNEL_COLORS[entry.name] ?? "#1565C0"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

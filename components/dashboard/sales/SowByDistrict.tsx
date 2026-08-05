"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts"

const BRAND_COLORS: Record<string, string> = {
  PINACO: "#1565C0",
  GS: "#FDD835",
  Enimac: "#E91E63",
  Globe: "#9C27B0",
  "Thiên Năng": "#4CAF50",
  Yamato: "#FF7043",
  Xupai: "#42A5F5",
  "Cứu Hội": "#26C6DA",
  Khác: "#9E9E9E",
}

const DATA = [
  { name: "Tràng Bàng", PINACO: 37, GS: 14, Enimac: 10, Globe: 9, "Thiên Năng": 8, Yamato: 7, Xupai: 5, "Cứu Hội": 4, Khác: 6 },
  { name: "Gò Dầu", PINACO: 34, GS: 15, Enimac: 11, Globe: 9, "Thiên Năng": 8, Yamato: 7, Xupai: 6, "Cứu Hội": 4, Khác: 6 },
  { name: "Bến Cầu", PINACO: 37, GS: 17, Enimac: 10, Globe: 9, "Thiên Năng": 7, Yamato: 6, Xupai: 5, "Cứu Hội": 4, Khác: 5 },
  { name: "Dĩ An", PINACO: 40, GS: 17, Enimac: 10, Globe: 8, "Thiên Năng": 7, Yamato: 6, Xupai: 4, "Cứu Hội": 3, Khác: 5 },
  { name: "Thuận An", PINACO: 38, GS: 18, Enimac: 10, Globe: 8, "Thiên Năng": 8, Yamato: 6, Xupai: 4, "Cứu Hội": 3, Khác: 5 },
]

const BRANDS = Object.keys(BRAND_COLORS)

export function SowByDistrict() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">2. SOW THEO HUYỆN/THỊ XÃ</h3>
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={DATA} stackOffset="expand" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: number) => `${Math.round(value)}%`} />
          <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
          {BRANDS.map((brand) => (
            <Bar key={brand} dataKey={brand} stackId="a" fill={BRAND_COLORS[brand]}>
              <LabelList
                dataKey={brand}
                position="center"
                style={{ fontSize: 10, fill: "#fff", fontWeight: 600 }}
                formatter={(v: number) => (v >= 5 ? `${v}%` : "")}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

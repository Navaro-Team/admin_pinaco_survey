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
  PINACO:       "#1565C0",
  GS:           "#42A5F5",
  Enimac:       "#4CAF50",
  Globe:        "#26C6DA",
  "Thiên Năng": "#FDD835",
  Yamato:       "#9C27B0",
  Xupai:        "#E91E63",
  "Cứu Hội":   "#795548",
  Khác:         "#9E9E9E",
}

const DATA = [
  { name: "Tràng Bàng",     PINACO: 15, GS: 26, Enimac: 19, Globe: 8, "Thiên Năng": 10, Yamato: 7, Xupai: 6, "Cứu Hội": 4, Khác: 5 },
  { name: "Gò Dầu",         PINACO: 14, GS: 25, Enimac: 18, Globe: 8, "Thiên Năng": 11, Yamato: 8, Xupai: 6, "Cứu Hội": 4, Khác: 6 },
  { name: "Dương Minh Châu", PINACO: 17, GS: 27, Enimac: 17, Globe: 8, "Thiên Năng": 9,  Yamato: 7, Xupai: 6, "Cứu Hội": 4, Khác: 5 },
  { name: "Hòa Thành",      PINACO: 19, GS: 26, Enimac: 18, Globe: 7, "Thiên Năng": 10, Yamato: 7, Xupai: 5, "Cứu Hội": 3, Khác: 5 },
  { name: "Tân Biên",       PINACO: 21, GS: 26, Enimac: 16, Globe: 7, "Thiên Năng": 9,  Yamato: 6, Xupai: 5, "Cứu Hội": 4, Khác: 6 },
]

const BRANDS = Object.keys(BRAND_COLORS)

export function InventoryShareByDistrict() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">2. INVENTORY SHARE — TỶ TRỌNG TỒN KHO</h3>
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={DATA} stackOffset="expand" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            label={{ value: "Huyện/Thị xã", position: "insideBottom", offset: -8, fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: number) => `${Math.round(value)}%`} />
          <Legend iconType="square" wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
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

"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const DATA = [
  { name: "PINACO", value: 34, color: "#1565C0" },
  { name: "GS", value: 24, color: "#FDD835" },
  { name: "Enimac", value: 10, color: "#E91E63" },
  { name: "Globe", value: 7, color: "#9C27B0" },
  { name: "Thiên Năng", value: 8, color: "#4CAF50" },
  { name: "Khác", value: 17, color: "#9E9E9E" },
]

export function CategorySow() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 flex flex-col">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
        <h3 className="text-base font-bold text-blue-700 mb-0.5">3. CATEGORY SOW — TRẬN ĐỊA CỤC BỘ</h3>
        <span className="text-sm text-gray-500">Ngành hàng: Tất cả</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="relative w-56 h-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-blue-700">100%</span>
              <span className="text-xs text-gray-500 text-center leading-tight">Doanh số ngành</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex justify-between text-xs text-gray-400 font-medium px-1.5 mb-1">
              <span>Thương hiệu</span>
              <span>Tỷ trọng</span>
            </div>
            <div className="border rounded-lg overflow-hidden divide-y">
              {DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

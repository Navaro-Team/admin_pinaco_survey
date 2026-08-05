"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Combobox } from "@/components/ui/combobox"

const CATEGORY_OPTIONS = [
  { value: "all", label: "Tất cả ngành hàng" },
  { value: "oto", label: "Ô tô" },
  { value: "xe-may", label: "Xe máy" },
  { value: "xe-tai", label: "Xe tải" },
]

type BrandShare = { name: string; value: number; color: string }

const DATA_BY_CATEGORY: Record<string, BrandShare[]> = {
  all: [
    { name: "PINACO", value: 27, color: "#1565C0" },
    { name: "GS", value: 23, color: "#42A5F5" },
    { name: "Enimac", value: 18, color: "#4CAF50" },
    { name: "Globe", value: 9, color: "#26C6DA" },
    { name: "Thiên Năng", value: 8, color: "#FDD835" },
    { name: "Yamato", value: 6, color: "#9C27B0" },
    { name: "Xupai", value: 5, color: "#E91E63" },
    { name: "Cứu Hội", value: 3, color: "#795548" },
    { name: "Khác", value: 1, color: "#9E9E9E" },
  ],
  oto: [
    { name: "PINACO", value: 32, color: "#1565C0" },
    { name: "GS", value: 28, color: "#42A5F5" },
    { name: "Enimac", value: 14, color: "#4CAF50" },
    { name: "Globe", value: 8, color: "#26C6DA" },
    { name: "Thiên Năng", value: 6, color: "#FDD835" },
    { name: "Yamato", value: 5, color: "#9C27B0" },
    { name: "Xupai", value: 4, color: "#E91E63" },
    { name: "Cứu Hội", value: 2, color: "#795548" },
    { name: "Khác", value: 1, color: "#9E9E9E" },
  ],
  "xe-may": [
    { name: "PINACO", value: 22, color: "#1565C0" },
    { name: "GS", value: 19, color: "#42A5F5" },
    { name: "Enimac", value: 21, color: "#4CAF50" },
    { name: "Globe", value: 11, color: "#26C6DA" },
    { name: "Thiên Năng", value: 10, color: "#FDD835" },
    { name: "Yamato", value: 7, color: "#9C27B0" },
    { name: "Xupai", value: 6, color: "#E91E63" },
    { name: "Cứu Hội", value: 3, color: "#795548" },
    { name: "Khác", value: 1, color: "#9E9E9E" },
  ],
  "xe-tai": [
    { name: "PINACO", value: 35, color: "#1565C0" },
    { name: "GS", value: 25, color: "#42A5F5" },
    { name: "Enimac", value: 15, color: "#4CAF50" },
    { name: "Globe", value: 7, color: "#26C6DA" },
    { name: "Thiên Năng", value: 7, color: "#FDD835" },
    { name: "Yamato", value: 5, color: "#9C27B0" },
    { name: "Xupai", value: 4, color: "#E91E63" },
    { name: "Cứu Hội", value: 1, color: "#795548" },
    { name: "Khác", value: 1, color: "#9E9E9E" },
  ],
}

export function CategoryInventoryShare() {
  const [category, setCategory] = useState("all")
  const data = DATA_BY_CATEGORY[category]
  const categoryLabel = CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? ""

  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 flex flex-col">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
        <h3 className="text-base font-bold text-blue-700">3. CATEGORY INVENTORY SHARE</h3>
        <span className="text-sm text-gray-500">Ngành hàng: Tất cả</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Donut */}
          <div className="relative w-56 h-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={104}
                  dataKey="value"
                  paddingAngle={1}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-semibold text-blue-700 text-center leading-tight px-4">{categoryLabel}</span>
            </div>
          </div>

          {/* Legend table */}
          <div className="flex-1 w-full">
            <div className="border rounded-lg overflow-hidden divide-y">
              {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.value}%</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50">
                <span className="text-sm font-semibold text-gray-700">Tổng</span>
                <span className="text-sm font-semibold text-gray-700">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

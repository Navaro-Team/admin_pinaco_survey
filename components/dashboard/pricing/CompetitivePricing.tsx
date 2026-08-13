"use client"

import { useState, useMemo } from "react"
import { AlertTriangle } from "lucide-react"
import { SkeletonChart } from "@/components/dashboard/common/Skeleton"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LabelList,
} from "recharts"
import { BRAND_COLORS, type CompetitiveData } from "@/features/dashboard/dashboard.types"
import { BRANDS_CARRIED } from "@/utils/survey-constants"

function fmtVND(v: number) {
  return new Intl.NumberFormat("vi-VN").format(v) + " đ"
}

const CustomLabel = ({ x, y, width, value }: any) => (
  <text x={x + width / 2} y={y - 4} fill="#374151" fontSize={10} textAnchor="middle">
    {fmtVND(value)}
  </text>
)

interface Props {
  data?: CompetitiveData
  isLoading?: boolean
}

export function CompetitivePricing({ data, isLoading }: Props) {
  const [selectedStore, setSelectedStore] = useState<string>("")
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])

  const stores = data?.stores ?? []
  const comparison = data?.comparison ?? []
  const alert = data?.alert

  const allCompetitors = useMemo(() => comparison.map(r => r.competitor), [comparison])

  const activeStore = selectedStore === ""
    ? null
    : (stores.find(s => s.store_id === selectedStore || s.store_name === selectedStore) ?? stores[0])
  const activeCompetitors = selectedCompetitors.length > 0 ? selectedCompetitors : allCompetitors.slice(0, 2)
  const activeBrands = useMemo(() => ["PINACO", ...activeCompetitors], [activeCompetitors])

  const chartData = useMemo(() => {
    if (stores.length === 0) return []
    const sourceStores = activeStore ? [activeStore] : stores
    // Collect all SKU names across selected stores
    const skuNames = [...new Set(sourceStores.flatMap(s => s.groups.map(g => g.sku_name)))]
    return skuNames.map(sku => {
      const entry: Record<string, any> = { name: sku }
      for (const brand of activeBrands) {
        const vals = sourceStores
          .flatMap(s => s.groups.filter(g => g.sku_name === sku).map(g => g.prices[brand]))
          .filter((v): v is number => v != null && v > 0)
        entry[brand] = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
      }
      return entry
    })
  }, [activeStore, stores, activeBrands])

  const compRows = comparison.filter(r => activeCompetitors.includes(r.competitor))

  if (isLoading) return <SkeletonChart height={360} />

  const toggleCompetitor = (brand: string) => {
    setSelectedCompetitors(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className={`bg-white border rounded-xl px-3 py-2.5 ${isLoading ? "opacity-60" : ""}`}>
      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <h3 className="text-base font-bold text-blue-700 shrink-0">2. TƯƠNG QUAN GIÁ CẠNH TRANH</h3>
        <div className="flex flex-wrap gap-2 sm:ml-3">
          {/* Store filter */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-gray-400 font-medium">Cửa hàng</label>
            <select
              value={activeStore?.store_name ?? ""}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="text-xs border rounded px-2 py-1 text-gray-700 min-w-40"
            >
              {stores.length === 0
                ? <option value="">Chưa có dữ liệu</option>
                : <>
                    <option value="">Tất cả cửa hàng</option>
                    {stores.map(s => <option key={s.store_id} value={s.store_name}>{s.store_name}</option>)}
                  </>
              }
            </select>
          </div>
          {/* Competitor filter */}
          {allCompetitors.length > 0 && (
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400 font-medium">Thương hiệu đối thủ</label>
              <div className="flex gap-1 flex-wrap">
                {allCompetitors.map(brand => (
                  <button
                    key={brand}
                    onClick={() => toggleCompetitor(brand)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${activeCompetitors.includes(brand)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-300"
                      }`}
                  >
                    {BRANDS_CARRIED.find(b => b.brandCode === brand)?.brandName ?? brand}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {stores.length === 0 ? (
        <div className="flex items-center justify-center h-70 text-gray-400 text-sm">Chưa có dữ liệu</div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Grouped bar chart */}
          <div className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number, name: string) => [fmtVND(v), BRANDS_CARRIED.find(b => b.brandCode === name)?.brandName ?? name]} />
                <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} formatter={(name) => BRANDS_CARRIED.find(b => b.brandCode === name)?.brandName ?? name} />
                {activeBrands.map(brand => (
                  <Bar key={brand} dataKey={brand} fill={BRAND_COLORS[brand] ?? "#9ca3af"} radius={[3, 3, 0, 0]}>
                    <LabelList content={<CustomLabel />} />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison table + alert */}
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="text-left font-bold text-gray-700 px-3 py-2">Đối thủ</th>
                    <th className="text-center font-bold text-gray-700 px-2 py-2 text-xs">Số CH</th>
                    <th className="text-center font-bold text-gray-700 px-2 py-2 text-xs">PINACO cao hơn</th>
                    <th className="text-center font-bold text-gray-700 px-2 py-2 text-xs">PINACO bằng</th>
                    <th className="text-center font-bold text-gray-700 px-2 py-2 text-xs">PINACO thấp hơn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {compRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 text-xs py-4">Chọn ít nhất 1 đối thủ</td>
                    </tr>
                  ) : compRows.map(row => (
                    <tr key={row.competitor} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: BRAND_COLORS[row.competitor] ?? "#9ca3af" }} />
                          {BRANDS_CARRIED.find(b => b.brandCode === row.competitor)?.brandName ?? row.competitor}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center text-gray-600">{row.store_count}</td>
                      <td className="px-2 py-2 text-center font-semibold text-blue-600">{row.higher_pct}%</td>
                      <td className="px-2 py-2 text-center font-semibold text-gray-400">{row.same_pct}%</td>
                      <td className="px-2 py-2 text-center font-semibold text-red-500">{row.lower_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {alert && (
              <div className="border-2 border-red-400 rounded-xl bg-red-50 px-3 py-3 flex gap-2 items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-600 mb-0.5">Lệch biên độ giá cạnh tranh</p>
                  <p className="text-xs text-red-500">{alert}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

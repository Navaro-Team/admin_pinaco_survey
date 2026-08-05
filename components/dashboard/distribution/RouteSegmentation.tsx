"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend } from "recharts"
import { cn } from "@/lib/utils"

type Cluster = "A" | "B" | "C" | "D"

const CLUSTER_COLORS: Record<Cluster, string> = {
  A: "#1565C0",
  B: "#4CAF50",
  C: "#FDD835",
  D: "#E91E63",
}

const CLUSTER_LABELS: Record<Cluster, string> = {
  A: "A — Tuyến vàng (SOW cao, dày đặc)",
  B: "B — Tuyến tiềm năng (SOW thấp, dày đặc)",
  C: "C — Tuyến ổn định (SOW cao, thưa)",
  D: "D — Tuyến yếu (SOW thấp, thưa)",
}

const SCATTER_DATA: Record<Cluster, { x: number; y: number; z: number; name: string }[]> = {
  A: [
    { x: 85, y: 42, z: 1250, name: "Tuyến Tràng Bàng - TN" },
    { x: 78, y: 38, z: 980,  name: "Tuyến Dĩ An - BD"      },
    { x: 92, y: 44, z: 1420, name: "Tuyến Thuận An - BD"   },
  ],
  B: [
    { x: 80, y: 24, z: 860,  name: "Tuyến Gò Dầu - TN"     },
    { x: 75, y: 21, z: 740,  name: "Tuyến Bến Cầu - TN"    },
  ],
  C: [
    { x: 40, y: 45, z: 520,  name: "Tuyến Hòa Thành - TN"  },
    { x: 35, y: 41, z: 480,  name: "Tuyến Dương MC - TN"   },
  ],
  D: [
    { x: 28, y: 18, z: 310,  name: "Tuyến Tân Biên - TN"   },
    { x: 22, y: 15, z: 260,  name: "Tuyến Châu Thành - TN" },
  ],
}

const CLUSTERS: Cluster[] = ["A", "B", "C", "D"]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="bg-white border rounded-lg px-3 py-2 shadow text-xs">
      <p className="font-semibold text-gray-700">{d.name}</p>
      <p className="text-gray-500">Mật độ: {d.x} CH/tuyến</p>
      <p className="text-gray-500">SOW PINACO: {d.y}%</p>
      <p className="text-gray-500">Doanh số: {d.z.toLocaleString()} tr</p>
    </div>
  )
}

export function RouteSegmentation() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">2. ROUTE SEGMENTATION — PHÂN CỤM TUYẾN</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Scatter chart */}
        <div className="lg:col-span-2">
          <p className="text-xs text-gray-400 mb-1">Trục X: Mật độ cửa hàng / tuyến &nbsp;·&nbsp; Trục Y: SOW PINACO (%) &nbsp;·&nbsp; Kích thước: Doanh số</p>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Mật độ" unit=" CH" tick={{ fontSize: 11 }} label={{ value: "Mật độ CH/tuyến", position: "insideBottom", offset: -4, fontSize: 11, fill: "#9ca3af" }} />
              <YAxis dataKey="y" name="SOW" unit="%" tick={{ fontSize: 11 }} domain={[0, 60]} />
              <ZAxis dataKey="z" range={[60, 300]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              {CLUSTERS.map((cluster) => (
                <Scatter
                  key={cluster}
                  name={`Cụm ${cluster}`}
                  data={SCATTER_DATA[cluster]}
                  fill={CLUSTER_COLORS[cluster]}
                  fillOpacity={0.8}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Cluster legend */}
        <div className="flex flex-col gap-2 justify-center">
          {CLUSTERS.map((cluster) => (
            <div key={cluster} className={cn("border rounded-lg px-3 py-2", `border-l-4`)} style={{ borderLeftColor: CLUSTER_COLORS[cluster] }}>
              <p className="text-xs font-semibold text-gray-700">{CLUSTER_LABELS[cluster]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{SCATTER_DATA[cluster].length} tuyến</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

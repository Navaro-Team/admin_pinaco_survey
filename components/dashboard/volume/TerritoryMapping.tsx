"use client"

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const RADAR_DATA = [
  { subject: "Mật độ CH",  PINACO: 82, GS: 65, Enimac: 48 },
  { subject: "SOW",        PINACO: 87, GS: 60, Enimac: 40 },
  { subject: "Sản lượng",  PINACO: 78, GS: 55, Enimac: 35 },
  { subject: "Tồn kho",    PINACO: 72, GS: 58, Enimac: 42 },
  { subject: "Giá TB",     PINACO: 65, GS: 70, Enimac: 55 },
  { subject: "Tăng trưởng",PINACO: 70, GS: 52, Enimac: 38 },
]

type Priority = "Ưu tiên" | "Theo dõi" | "Bão hòa"

const TERRITORY_TABLE: {
  territory: string
  district: string
  volumeShare: number
  growth: number
  priority: Priority
}[] = [
  { territory: "Miền Nam – Tràng Bàng",     district: "Tây Ninh",  volumeShare: 34, growth: 8,   priority: "Ưu tiên"   },
  { territory: "Miền Nam – Dĩ An",           district: "Bình Dương",volumeShare: 29, growth: 5,   priority: "Theo dõi"  },
  { territory: "Miền Đông – Thuận An",       district: "Bình Dương",volumeShare: 32, growth: 12,  priority: "Ưu tiên"   },
  { territory: "Miền Đông – Gò Dầu",         district: "Tây Ninh",  volumeShare: 21, growth: -2,  priority: "Theo dõi"  },
  { territory: "Miền Tây – Hòa Thành",       district: "Tây Ninh",  volumeShare: 18, growth: -5,  priority: "Bão hòa"   },
  { territory: "Miền Tây – Dương Minh Châu", district: "Tây Ninh",  volumeShare: 15, growth: -8,  priority: "Bão hòa"   },
]

const PRIORITY_STYLE: Record<Priority, string> = {
  "Ưu tiên":  "bg-green-100 text-green-700 border border-green-300",
  "Theo dõi": "bg-yellow-50 text-yellow-700 border border-yellow-300",
  "Bão hòa":  "bg-gray-100 text-gray-500 border border-gray-300",
}

export function TerritoryMapping() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">2. TERRITORY MAPPING</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Radar chart */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Năng lực cạnh tranh theo lãnh thổ (điểm chuẩn hóa 0–100)</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="PINACO" dataKey="PINACO" stroke="#1565C0" fill="#1565C0" fillOpacity={0.25} />
              <Radar name="GS"     dataKey="GS"     stroke="#FDD835" fill="#FDD835" fillOpacity={0.2}  />
              <Radar name="Enimac" dataKey="Enimac" stroke="#E91E63" fill="#E91E63" fillOpacity={0.15} />
              <Tooltip />
              <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Territory table */}
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-bold text-gray-700">Lãnh thổ</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Vol. Share</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">Tăng trưởng</TableHead>
                <TableHead className="font-bold text-gray-700">Ưu tiên</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TERRITORY_TABLE.map((row) => (
                <TableRow key={row.territory}>
                  <TableCell>
                    <p className="font-medium text-gray-700 text-xs">{row.territory}</p>
                    <p className="text-xs text-gray-400">{row.district}</p>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-blue-600">{row.volumeShare}%</TableCell>
                  <TableCell className={cn("text-right font-semibold", row.growth >= 0 ? "text-green-600" : "text-red-500")}>
                    {row.growth > 0 ? "+" : ""}{row.growth}%
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", PRIORITY_STYLE[row.priority])}>
                      {row.priority}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

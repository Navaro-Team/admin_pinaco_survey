"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

type Dealer = {
  name: string
  district: string
  totalRevenue: number
  sowPinaco: number
  segment: "Trung thành" | "Tiềm năng" | "Bị chiếm lĩnh"
  mainCompetitor: string
  competitorShare: number
}

const DATA: Dealer[] = [
  { name: "Đại lý Minh Phát", district: "Tràng Bàng", totalRevenue: 1250, sowPinaco: 48, segment: "Trung thành", mainCompetitor: "GS", competitorShare: 27 },
  { name: "Đại lý Thành Công", district: "Gò Dầu", totalRevenue: 980, sowPinaco: 32, segment: "Tiềm năng", mainCompetitor: "GS", competitorShare: 41 },
  { name: "Đại lý Hưng Thịnh", district: "Bến Cầu", totalRevenue: 1180, sowPinaco: 28, segment: "Tiềm năng", mainCompetitor: "Enimac", competitorShare: 36 },
  { name: "Đại lý An Phú", district: "Dĩ An", totalRevenue: 1620, sowPinaco: 22, segment: "Bị chiếm lĩnh", mainCompetitor: "GS", competitorShare: 47 },
  { name: "Đại lý Phú Lợi", district: "Thuận An", totalRevenue: 1450, sowPinaco: 18, segment: "Bị chiếm lĩnh", mainCompetitor: "GS", competitorShare: 45 },
  { name: "Đại lý Tân Tiến", district: "Tràng Bàng", totalRevenue: 720, sowPinaco: 25, segment: "Tiềm năng", mainCompetitor: "Enimac", competitorShare: 39 },
  { name: "Đại lý Gia Bảo", district: "Gò Dầu", totalRevenue: 610, sowPinaco: 16, segment: "Bị chiếm lĩnh", mainCompetitor: "GS", competitorShare: 53 },
  { name: "Đại lý Hòa Phát", district: "Bến Cầu", totalRevenue: 540, sowPinaco: 45, segment: "Trung thành", mainCompetitor: "Enimac", competitorShare: 22 },
  { name: "Đại lý Nam Phát", district: "Dĩ An", totalRevenue: 950, sowPinaco: 30, segment: "Tiềm năng", mainCompetitor: "GS", competitorShare: 40 },
  { name: "Đại lý Tín Nghĩa", district: "Thuận An", totalRevenue: 830, sowPinaco: 20, segment: "Bị chiếm lĩnh", mainCompetitor: "Enimac", competitorShare: 42 },
]

const SEGMENT_STYLE: Record<Dealer["segment"], string> = {
  "Trung thành": "bg-green-100 text-green-700 border border-green-300",
  "Tiềm năng": "bg-yellow-50 text-yellow-700 border border-yellow-300",
  "Bị chiếm lĩnh": "bg-red-50 text-red-600 border border-red-300",
}

const topPriority = DATA.filter((d) => d.segment === "Bị chiếm lĩnh").sort((a, b) => b.totalRevenue - a.totalRevenue)[0]

export function BusinessOutcome() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5">
      <h3 className="text-base font-bold text-blue-700 mb-2">4. BUSINESS OUTCOME — PHÂN NHÓM ĐẠI LÝ</h3>
      <div className="overflow-x-auto">
        <Table className="text-sm min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-bold text-gray-700">Đại lý</TableHead>
              <TableHead className="font-bold text-gray-700">Huyện/Thị xã</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">Tổng DS/tháng (Triệu VNĐ)</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">SOW PINACO (%)</TableHead>
              <TableHead className="font-bold text-gray-700">Phân nhóm</TableHead>
              <TableHead className="font-bold text-gray-700">Đối thủ chính</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DATA.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium text-gray-700">{row.name}</TableCell>
                <TableCell className="text-gray-500">{row.district}</TableCell>
                <TableCell className="text-right font-medium">{row.totalRevenue.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">{row.sowPinaco}%</TableCell>
                <TableCell>
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", SEGMENT_STYLE[row.segment])}>
                    {row.segment}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">
                  {row.mainCompetitor} · {row.competitorShare}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {topPriority && (
        <div className="mt-1.5 flex items-start gap-1.5 bg-blue-50 rounded-lg px-2 py-1.5 text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Ưu tiên Sales: xử lý trước đại lý Bị chiếm lĩnh có Tổng doanh số lớn nhất.
          </span>
        </div>
      )}
    </div>
  )
}

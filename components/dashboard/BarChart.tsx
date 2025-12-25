"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { date: "Thứ Hai", surveys: 20 },
  { date: "Thứ Ba", surveys: 12 },
  { date: "Thứ Tư", surveys: 15 },
  { date: "Thứ Năm", surveys: 10 },
  { date: "Thứ Sáu", surveys: 18 },
  { date: "Thứ Bảy", surveys: 13 },
  { date: "Chủ Nhật", surveys: 16 },
]
const chartConfig = {
  surveys: {
    label: "Khảo sát",
    color: "var(--color-main)",
  },
} satisfies ChartConfig

export function BarChartComponent() {
  return (
    <div className="w-full h-full flex flex-col px-4">
      <div className="flex flex-col gap-1 pb-4 mb-4 border-b">
        <h3 className="text-lg font-semibold">Tiến độ khảo sát trong tuần</h3>
        <p className="text-sm text-muted-foreground">Số lượng khảo sát thực hiện theo ngày</p>
      </div>
      <div className="flex-1 flex items-center justify-center min-h-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="surveys" fill="var(--color-surveys)" radius={8} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  {
    quota: "L1",
    progress: 20,
  },
  {
    quota: "L2",
    progress: 15,
  },
  {
    quota: "L3",
    progress: 17,
  },
  {
    quota: "L4",
    progress: 10,
  },
  {
    quota: "L5",
    progress: 8,
  },
  {
    quota: "L6",
    progress: 2,
  },
  {
    quota: "L7",
    progress: 4,
  },
]

const chartConfig = {
  progress: {
    label: "Quy mô doanh số",
    color: "#2563eb",
  },
} satisfies ChartConfig

export function OperationProgress() {
  return (
    <div className="w-full h-full flex flex-col px-4">
      <div className="flex-1 flex items-center justify-center min-h-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quota"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="progress" fill="var(--color-progress)" radius={8} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
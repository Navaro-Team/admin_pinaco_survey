"use client"
import * as React from "react"
import { Label, Legend, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const brandData = [
  { brand: "pinaco", value: 305, fill: "#20409a" },
  { brand: "gs", value: 186, fill: "#10b981" },
  { brand: "enimac", value: 173, fill: "#f59e0b" },
  { brand: "globe", value: 120, fill: "#6b7280" },
  { brand: "others", value: 100, fill: "#8b5cf6" },
]

const chartConfig = {
  pinaco: {
    label: "Pinaco",
    color: "#20409a",
  },
  gs: {
    label: "GS",
    color: "#10b981",
  },
  enimac: {
    label: "Enimac",
    color: "#f59e0b",
  },
  globe: {
    label: "Globe",
    color: "#6b7280",
  },
  others: {
    label: "Other",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function ChartPieInteractive() {
  const id = "pie-interactive"

  return (
    <div data-chart={id} className="flex flex-col space-y-4">
      <ChartStyle id={id} config={chartConfig} />
      <div className="flex flex-col gap-1 px-4 pb-4 mb-4 border-b">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold">Cơ cấu sản phẩm</h3>
          <p className="text-sm text-muted-foreground">Tỷ trọng thương hiệu ắc quy</p>
        </div>
      </div>
      <div className="flex justify-center">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={brandData}
              dataKey="value"
              nameKey="brand"
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {brandData[0].value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Pinaco
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string) => chartConfig[value as keyof typeof chartConfig]?.label || value}
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}
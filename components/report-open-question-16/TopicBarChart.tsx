"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { OpenQuestionTopicStat } from "@/features/openQuestion16/openQuestion16.types"

const COLORS = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];
const chartConfig = { value: { label: "Giá trị" } } satisfies ChartConfig

interface Props {
  topics: OpenQuestionTopicStat[];
  selectedTopic: string | null;
  onSelectTopic: (key: string | null) => void;
}

export function TopicBarChart({ topics, selectedTopic, onSelectTopic }: Props) {
  const [viewMode, setViewMode] = useState<'count' | 'percentage'>('percentage');

  const chartData = useMemo(() => {
    return (topics || []).map((t) => ({
      key: t.key, label: t.label, value: viewMode === 'count' ? t.count : Number(t.percentage.toFixed(1)),
    }));
  }, [topics, viewMode]);

  return (
    <div className="w-full flex flex-col gap-3 px-4">
      <div className="flex justify-end">
        <ToggleGroup type="single" variant="outline" size="sm" value={viewMode}
          onValueChange={(value) => value && setViewMode(value as 'count' | 'percentage')}>
          <ToggleGroupItem value="count">Số lượt</ToggleGroupItem>
          <ToggleGroupItem value="percentage">Tỷ lệ %</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={160} />
          <ChartTooltip cursor={false}
            content={<ChartTooltipContent formatter={(value) => viewMode === 'percentage' ? `${value}%` : `${value}`} />} />
          <Bar dataKey="value" radius={8}
            onClick={(data: any) => onSelectTopic(selectedTopic === data.key ? null : data.key)}
            className="cursor-pointer">
            {chartData.map((entry, index) => (
              <Cell key={entry.key} fill={COLORS[index % COLORS.length]}
                opacity={!selectedTopic || selectedTopic === entry.key ? 1 : 0.35} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-gray-500 text-center">Bấm vào một chủ đề để xem các câu trả lời liên quan bên dưới.</p>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { Cell, PieChart, Pie, Label, Legend } from "recharts"
import { OpenQuestion16Report } from "@/features/openQuestion16/openQuestion16.types"

const TIER_CONFIG = {
  high: { label: 'Cao (≥80%)', color: '#22c55e' },
  medium: { label: 'Trung bình (60-79%)', color: '#f59e0b' },
  low: { label: 'Thấp (<60%)', color: '#ef4444' },
} as const;

interface Props {
  confidence?: OpenQuestion16Report['confidence'];
  selectedTier: 'high' | 'medium' | 'low' | null;
  onSelectTier: (tier: 'high' | 'medium' | 'low' | null) => void;
}

export function ConfidenceDonut({ confidence, selectedTier, onSelectTier }: Props) {
  const data = useMemo(() => {
    return (['high', 'medium', 'low'] as const).map((tier) => ({
      tier, name: TIER_CONFIG[tier].label, value: confidence?.[tier]?.count || 0,
    }));
  }, [confidence]);

  const highPercentage = confidence?.high?.percentage || 0;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <PieChart width={260} height={260}>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} innerRadius={64} dataKey="value"
          onClick={(entry: any) => onSelectTier(selectedTier === entry.tier ? null : entry.tier)}
          className="cursor-pointer">
          <Label value={`${highPercentage.toFixed(0)}% cao`} position="center" fontSize={14} fontWeight="bold" />
          {data.map((entry) => (
            <Cell key={entry.tier} fill={TIER_CONFIG[entry.tier].color}
              opacity={!selectedTier || selectedTier === entry.tier ? 1 : 0.35} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={48} iconSize={10} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
      <p className="text-xs text-gray-500 text-center">Kết quả có độ tin cậy Thấp cần được kiểm tra lại. Bấm vào một mức để lọc.</p>
    </div>
  )
}

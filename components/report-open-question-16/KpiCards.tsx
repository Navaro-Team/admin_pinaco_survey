"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CountUp from 'react-countup'
import { OpenQuestion16Report } from "@/features/openQuestion16/openQuestion16.types"

const SECONDARY_TOPIC_KEYS = ['KHUYEN_MAI', 'HAU_MAI', 'CHINH_SACH_BAN_HANG'];

interface Props {
  report: OpenQuestion16Report | null;
}

export function KpiCards({ report }: Props) {
  const totalValidAnswers = report?.totalValidAnswers || 0;
  const pendingCount = report?.pendingCount || 0;
  const quotaExhausted = !!report?.quotaExhausted;
  const productPercentage = report?.topics.find((t) => t.key === 'SAN_PHAM')?.percentage || 0;

  const secondaryCount = report?.answers.filter((a) =>
    a.topics.some((t) => SECONDARY_TOPIC_KEYS.includes(t))
  ).length || 0;
  const secondaryPercentage = totalValidAnswers > 0 ? (secondaryCount / totalValidAnswers) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Đã phân tích</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp className="text-main" end={totalValidAnswers} duration={2} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">
            Đang chờ phân tích{quotaExhausted && pendingCount > 0 ? " (hết quota)" : ""}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp
              className={quotaExhausted && pendingCount > 0 ? "text-red-500" : pendingCount > 0 ? "text-amber-500" : "text-gray-400"}
              end={pendingCount} duration={2} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Tỷ lệ nhắc đến &quot;Sản phẩm&quot;</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp className="text-teal-600" end={productPercentage} decimals={1} duration={2} />
            <span className="text-teal-600">%</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Tỷ lệ nhắc đến &quot;CTKM/Dịch vụ hậu mãi/Chính sách bán hàng&quot;</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp className="text-orange-500" end={secondaryPercentage} decimals={1} duration={2} />
            <span className="text-orange-500">%</span>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

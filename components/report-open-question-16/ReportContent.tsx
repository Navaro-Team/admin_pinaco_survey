"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardTitle, CardHeader, CardDescription, CardAction, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { SkeletonKPIRow, SkeletonChart, SkeletonDonut, SkeletonTable } from "@/components/dashboard/common/Skeleton"
import { KpiCards } from "./KpiCards"
import { TopicBarChart } from "./TopicBarChart"
import { ConfidenceDonut } from "./ConfidenceDonut"
import { AnswersTable } from "./AnswersTable"
import { OpenQuestion16Report } from "@/features/openQuestion16/openQuestion16.types"

interface Props {
  report: OpenQuestion16Report | null;
  isLoading?: boolean;
  error?: string;
}

export function ReportContent({ report, isLoading, error }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<'high' | 'medium' | 'low' | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonKPIRow cols={4} />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-3/5"><SkeletonChart height={280} /></div>
          <div className="flex-2/5"><SkeletonDonut /></div>
        </div>
        <SkeletonTable rows={6} cols={4} />
      </div>
    );
  }

  if (error && !report) {
    return (
      <Card className="@container/card py-12">
        <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-base font-medium text-destructive">Không thể tải báo cáo</p>
          <p className="text-sm text-gray-500">{error || "Có lỗi xảy ra. Vui lòng thử lại."}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!!report?.pendingCount && (
        report.quotaExhausted ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <strong>Đã hết hạn mức (quota) phân tích AI trong ngày hôm nay.</strong> Còn{" "}
            <strong>{report.pendingCount}</strong> câu trả lời chưa được phân tích.
            {report.quotaResetAt && (
              <> Hệ thống sẽ tự động tiếp tục phân tích vào khoảng{" "}
                <strong>{format(new Date(report.quotaResetAt), "HH:mm dd/MM/yyyy")}</strong>, không cần thao tác gì thêm — chỉ cần quay lại xem sau.</>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Còn <strong>{report.pendingCount}</strong> câu trả lời chưa được phân tích — hệ thống đang tự động phân tích
            dần, không cần tải lại trang.
          </div>
        )
      )}

      <KpiCards report={report} />

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="@container/card gap-2! py-4! flex-3/5">
          <CardHeader>
            <CardTitle>Các chủ đề AI phát hiện</CardTitle>
            <CardDescription hidden>Biểu đồ thanh ngang các chủ đề Câu 16</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">Số lượt / Tỷ lệ %</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0!">
            <TopicBarChart topics={report?.topics || []} selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
          </CardContent>
        </Card>

        <Card className="@container/card gap-2! py-4! flex-2/5">
          <CardHeader>
            <CardTitle>Mức độ tin cậy của AI</CardTitle>
            <CardDescription hidden>Phân bố độ tin cậy phân loại</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">Cao / TB / Thấp</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0! flex items-center justify-center">
            <ConfidenceDonut confidence={report?.confidence} selectedTier={selectedTier} onSelectTier={setSelectedTier} />
          </CardContent>
        </Card>
      </div>

      <Card className="@container/card gap-2! py-4!">
        <CardHeader>
          <CardTitle>Danh sách câu trả lời</CardTitle>
          <CardDescription hidden>Câu trả lời Câu 16 đã phân loại</CardDescription>
        </CardHeader>
        <CardContent className="px-2!">
          <AnswersTable answers={report?.answers || []} selectedTopic={selectedTopic} selectedTier={selectedTier} />
        </CardContent>
      </Card>
    </div>
  )
}

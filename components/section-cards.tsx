import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BadgeCheck, CheckCircle2Icon, PercentCircle, ReceiptTextIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card gap-4! py-4!">
        <CardHeader>
          <CardDescription>Tổng số khảo sát</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            68
          </CardTitle>
          <CardAction className="flex items-center gap-1 bg-blue-500/10 p-2 rounded-md">
            <ReceiptTextIcon className="size-6 text-blue-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-row items-center gap-1 text-sm">
          <Badge variant="secondary">
            <IconTrendingUp className="size-4 text-green-500" />
            <span className="text-sm text-green-500">+12.5%</span>
          </Badge>
          <div className="line-clamp-1 flex gap-2 font-medium">
            so với tháng trước <IconTrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-4! py-4!">
        <CardHeader>
          <CardDescription>Đã hoàn thành</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4
          </CardTitle>
          <CardAction className="flex items-center gap-1 bg-green-500/10 p-2 rounded-md">
            <CheckCircle2Icon className="size-6 text-green-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            Mục tiêu 12 khảo sát
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-4! py-4!">
        <CardHeader>
          <CardDescription>Tỷ lệ hoàn thành</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            67.65%
          </CardTitle>
          <CardAction className="flex items-center gap-1 bg-blue-500/10 p-2 rounded-md">
            <PercentCircle className="size-6 text-purple-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-row items-center gap-1 text-sm">
          <Badge variant="secondary">
            <IconTrendingUp className="size-4 text-green-500" />
            <span className="text-sm text-green-500">+12.5%</span>
          </Badge>
          <div className="line-clamp-1 flex font-medium">so với tuần trước</div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-4! py-4!">
        <CardHeader>
          <CardDescription>Khảo sát mới</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8
          </CardTitle>
          <CardAction className="flex items-center gap-1 bg-orange-500/10 p-2 rounded-md">
            <BadgeCheck className="size-6 text-orange-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-row items-start gap-1 text-sm">
          <span className="text-green-500">+5</span>
          <div className="text-muted-foreground">hôm nay</div>
        </CardFooter>
      </Card>
    </div>
  )
}

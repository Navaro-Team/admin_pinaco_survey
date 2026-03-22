
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAppSelector } from "@/hooks/redux";
import { Skeleton } from "./ui/skeleton";
import CountUp from "react-countup";

export function SectionCards() {
  // const campaignStatistics = useAppSelector((state: any) => state.campaigns.campaignStatistics);
  const campaignState = useAppSelector((state: any) => state.campaigns.requestState);
  const isLoading = campaignState.status === 'loading' && campaignState.type === 'getCampaignStatistics';

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card gap-2! py-4!">
        <CardHeader>
          <CardDescription>Tỷ lệ thâm nhập PINACO</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="w-full h-10" /> : <><CountUp end={100} duration={2} />%</>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-xs text-green-500">5/5 điểm bán có kinh doanh PINACO</span>
        </CardContent>
      </Card>
      <Card className="@container/card gap-2! py-4!">
        <CardHeader>
          <CardDescription>Tỷ lệ phủ bảng hiệu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="w-full h-10" /> : <><CountUp end={100} duration={2} />%</>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-orange-500">Cần đối chiếu ảnh mặt tiền</span>
        </CardContent>
      </Card>
      <Card className="@container/card gap-2! py-4!">
        <CardHeader>
          <CardDescription>Mẫu hợp lệ</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="w-full h-10" /> : <CountUp end={5} duration={2} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-green-500">Tất cả đã duyệt</span>
        </CardContent>
      </Card>
      <Card className="@container/card gap-2! py-4!">
        <CardHeader>
          <CardDescription>CSAT thấp cần xử lý</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="w-full h-10" /> : <CountUp end={1} duration={2} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-red-500">Có 1 chỉ tiêu cần xem lại</span>
        </CardContent>
      </Card>
      <Card className="@container/card gap-2! py-4!">
        <CardHeader>
          <CardDescription>Tỷ lệ thị phần sản lượng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="w-full h-10" /> : <><CountUp end={80} duration={2} />/<CountUp end={20} duration={2} /></>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-gray-500">PINACO / GS</span>
        </CardContent>
      </Card>
    </div>
  )
}

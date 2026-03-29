"use client"

import { BarChartComponent } from "@/components/dashboard/BarChart";
import { MarketShare } from "@/components/dashboard/MarketShare";
import { OperationProgress } from "@/components/dashboard/OperationProgress";
import { SectionCards } from "@/components/section-cards"
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { changeCampaignStatistics, getCampaigns, getCampaignStatistics } from "@/features/campaigns/campaigns.slice";
import { useAppDispatch } from "@/hooks/redux";
import { parseCampaigns, parseCampaignStatistics } from "@/model/Campaign.model";
import { useEffect } from "react";

export default function Page() {
  const dispatch = useAppDispatch();

  const handleGetStatistics = async () => {
    await dispatch(getCampaigns())
      .unwrap()
      .then(async (res) => {
        const payload = res as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        const campaigns = parseCampaigns(responseData?.campaigns || []);
        if (campaigns.length > 0) {
          const campaign = campaigns[0];
          await dispatch(getCampaignStatistics(campaign._id))
            .unwrap()
            .then(async (res) => {
              const payload = res as any;
              const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
              const statistics = parseCampaignStatistics(responseData);
              dispatch(changeCampaignStatistics(statistics));
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    handleGetStatistics()
    return () => { }
  }, []);

  const crosstabMockData = [
    {
      region: "TP. Tây Ninh",
      chuyen_aq_oto: 1,
      gara_oto: 0,
      total_point: 1,
    },
    {
      region: "Trảng bàng",
      chuyen_aq_oto: 1,
      gara_oto: 0,
      total_point: 1,
    },
    {
      region: "Hoà Thành",
      chuyen_aq_oto: 1,
      gara_oto: 0,
      total_point: 1,
    },
    {
      region: "Bình Dương",
      chuyen_aq_oto: 1,
      gara_oto: 1,
      total_point: 2,
    },
  ]

  const csatMockData = [
    {
      criteria: "CTKH dễ hiểu",
      mean: 4.6,
      median: 3,
      caution: "Theo dõi",
    },
    {
      criteria: "Tần suất CTKM",
      mean: 5.0,
      median: 5,
      caution: "Ổn định",
    },
    {
      criteria: "Vận chuyển",
      mean: 5.0,
      median: 5,
      caution: "Ổn định",
    },
  ]

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6 flex lg:flex-row flex-col gap-4">
        <Card className="@container/card gap-2! py-4! flex-3/5">
          <CardHeader>
            <CardTitle>Khối sàn lọc</CardTitle>
            <CardDescription hidden>Số lượng khảo sát thực hiện theo ngày</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">Pie / Bar / Crosstab</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0!">
            <BarChartComponent />
          </CardContent>
        </Card>

        <Card className="@container/card gap-2! py-4! flex-2/5">
          <CardHeader>
            <CardTitle>Crosstab khu vực × ngành hàng</CardTitle>
            <CardDescription hidden>Crosstab khu vực × ngành hàng</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">Bảng động</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2!">
            <Table className="w-full">
              <TableCaption hidden>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">KHU VỰC</TableHead>
                  <TableHead className="text-left">CHUYÊN AQ Ô TÔ</TableHead>
                  <TableHead className="text-left">GARA Ô TÔ</TableHead>
                  <TableHead className="text-left">TỔNG ĐIỂM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crosstabMockData.map((item: any, index: number) => (
                  <TableRow key={item.region + index}>
                    <TableCell className="font-medium flex flex-col gap-1">{item.region}</TableCell>
                    <TableCell>{item.chuyen_aq_oto}</TableCell>
                    <TableCell>{item.gara_oto}</TableCell>
                    <TableCell>{item.total_point}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="px-4 lg:px-6 flex lg:flex-row flex-col gap-4">
        <Card className="@container/card gap-2! py-4! flex-1/3">
          <CardHeader>
            <CardTitle>Vận hành & tiến độ</CardTitle>
            <CardDescription hidden>Vận hành & tiến độ</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">Quota L1-L7</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0!">
            <OperationProgress />
          </CardContent>
        </Card>

        <Card className="@container/card gap-2! py-4! flex-1/3">
          <CardHeader>
            <CardTitle>CSAT & dịch vụ</CardTitle>
            <CardDescription hidden>Vận hành & tiến độ</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">Mean / Median / Mode</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2!">
            <Table className="w-full">
              <TableCaption hidden>CSAT & dịch vụ</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">TIÊU CHÍ</TableHead>
                  <TableHead className="text-left">MEAN</TableHead>
                  <TableHead className="text-left">MEDIAN</TableHead>
                  <TableHead className="text-left">CẢNH BÁO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csatMockData.map((item: any, index: number) => (
                  <TableRow key={item.criteria + index}>
                    <TableCell className="font-medium flex flex-col gap-1">{item.criteria}</TableCell>
                    <TableCell>{item.mean}</TableCell>
                    <TableCell>{item.median}</TableCell>
                    <TableCell>{item.caution}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="@container/card gap-2! py-4! flex-1/3">
          <CardHeader>
            <CardTitle>Thị phần sản lượng</CardTitle>
            <CardDescription hidden>Thị phần sản lượng</CardDescription>
            <CardAction>
              <Badge className="bg-green-100 text-white">
                <span className="text-xs font-semibold text-green-700">3 lớp kết quả</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0! flex items-center justify-center flex-col">
            <MarketShare />
            <span className="text-sm text-gray-500">Cứ 10 bình bán ra thì có trung bình 8 bình PINACO và 2 bình GS.</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

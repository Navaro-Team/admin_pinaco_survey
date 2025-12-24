import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { ProgressBar } from "../ui/progress-bar";
export function AreaSurvey() {
  const areas = [
    {
      name: "Hà Nội",
      surveys: 25,
      stores: 30,
    },
    {
      name: "TP. Hồ Chí Minh",
      surveys: 20,
      stores: 25,
    },
    {
      name: "Đà Nẵng",
      surveys: 15,
      stores: 20,
    },
    {
      name: "Hải Phòng",
      surveys: 10,
      stores: 15,
    },
    {
      name: "Cần Thơ",
      surveys: 5,
      stores: 10,
    },
  ]
  return (
    <Card className="@container/card gap-4! py-4! flex-2/5">
      <CardHeader>
        <CardTitle>Khu vực khảo sát</CardTitle>
        <CardDescription>Top 5 tỉnh thành dẫn đầu</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {areas.map((area) => (
          <ProgressBar key={area.name} label={area.name} subLabel={`${area.stores} cửa hàng`} current={area.surveys} total={area.stores} />
        ))}
      </CardContent>
    </Card>
  )
}
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultServey() {
  return (
    <Card className="flex flex-col gap-4!">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <span>Kết quả khảo sát</span>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
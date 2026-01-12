"use client"

import { BarChartComponent } from "@/components/dashboard/BarChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { SectionCards } from "@/components/section-cards"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="h-[calc(100vh-var(--header-height))] flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6 flex lg:flex-row flex-col gap-4">
        <Card className="@container/card gap-4! py-4! flex-4/6">
          <BarChartComponent />
        </Card>
      </div>
      <div className="px-4 lg:px-6 flex lg:flex-row flex-col gap-4">
        <RecentActivity />
      </div>
    </div>
  )
}

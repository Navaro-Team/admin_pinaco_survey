"use client"

import { AssigneeInfo } from "@/components/schedule/common/AssigneeInfo"
import { HeaderDetailSchedule } from "@/components/schedule/common/HeaderDetailSchedule"
import { ResultServey } from "@/components/schedule/common/ResultServey"
import { StoreInfo } from "@/components/schedule/common/StoreInfo"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <HeaderDetailSchedule />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StoreInfo />
        <AssigneeInfo />
      </div>
      <ResultServey />
    </div>
  )
}
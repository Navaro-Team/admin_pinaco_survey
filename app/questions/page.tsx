"use client"

import { Filter } from "@/components/questions/Filter";
import { Header } from "@/components/questions/Header";
import { TableQuestion } from "@/components/questions/TableQuestion";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 h-[calc(100vh-var(--header-height))] overflow-hidden">
      <Header />
      <Filter />
      <div className="flex-1 min-h-0">
        <TableQuestion />
      </div>
    </div>
  )
}
"use client"

import { Filter } from "@/components/questions/Filter";
import { Header } from "@/components/questions/Header";
import { TableQuestion } from "@/components/questions/TableQuestion";

export default function Page() {
  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden flex flex-col gap-4 p-4 md:gap-6 md:py-6">
      <Header />
      <Filter />
      <TableQuestion />
    </div>
  )
}
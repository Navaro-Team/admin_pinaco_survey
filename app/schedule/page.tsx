"use client"

import { Filter } from "@/components/schedule/Filter"
import { Header } from "@/components/schedule/Header"
import { SectionCards } from "@/components/schedule/section-cards"
import { Table } from "@/components/schedule/Table"

export default function Page() {
  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <SectionCards />
      <Header />
      <Filter />
      <Table />
    </div>
  )
}
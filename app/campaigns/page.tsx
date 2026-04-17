"use client"

import { Header } from "@/components/campaigns/Header";
import { Filter } from "@/components/campaigns/Filter";
import { Table } from "@/components/campaigns/Table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Header />
      <Filter />
      <Table />
    </div>
  )
}
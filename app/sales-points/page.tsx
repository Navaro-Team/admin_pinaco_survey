"use client"

import { Filter } from "@/components/sales-points/Filter";
import { Header } from "@/components/sales-points/Header";
import { Table } from "@/components/sales-points/Table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Header />
      <Filter />
      <Table />
    </div>
  )
}
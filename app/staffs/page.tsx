"use client"

import { Filter } from "@/components/staffs/Filter";
import { Header } from "@/components/staffs/Header";
import { Table } from "@/components/staffs/Table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Header />
      <Filter />
      <Table />
    </div>
  )
}
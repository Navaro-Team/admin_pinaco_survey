"use client"

import { useState } from "react";
import { Eye, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Table as TableUI, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { TablePagination } from "../ui/table-pagination";
import Link from "next/link";

export function Table() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const staffs = [
    {
      id: 1,
      code: "NV001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      role: "Quản trị viên",
      status: "active",
    },
    {
      id: 2,
      code: "NV002",
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      role: "Quản lý",
      status: "active",
    },
    {
      id: 3,
      code: "NV003",
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      role: "Nhân viên",
      status: "inactive",
    },
    {
      id: 4,
      code: "NV004",
      name: "Phạm Thị D",
      email: "phamthid@gmail.com",
      role: "Nhân viên",
      status: "active",
    },
    {
      id: 5,
      code: "NV005",
      name: "Hoàng Văn E",
      email: "hoangvane@gmail.com",
      role: "Quản lý",
      status: "active",
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaffs = staffs.slice(startIndex, endIndex);

  return (
    <Card>
      <CardContent>
        <TableUI>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-10">STT</TableHead>
              <TableHead className="text-left">Mã nhân viên</TableHead>
              <TableHead className="text-left">Tên nhân viên</TableHead>
              <TableHead className="text-left">Vai trò</TableHead>
              <TableHead className="text-left">Trạng thái</TableHead>
              <TableHead className="text-left w-32">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStaffs.map((staff, index) => (
              <TableRow key={staff.id}>
                <TableCell className="text-center w-10">{startIndex + index + 1}</TableCell>
                <TableCell>{staff.code}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{staff.name}</span>
                    <span className="text-xs text-muted-foreground">{staff.email}</span>
                  </div>
                </TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}>
                    {staff.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Link href={`/staffs/${staff.id}`}>
                    <Button variant="outline" size="icon">
                      <Eye className="size-4 text-blue-500" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <TrashIcon className="size-4 text-red-500 hover:text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableUI>
        <TablePagination
          currentPage={currentPage}
          totalItems={staffs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  )
}


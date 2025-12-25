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

  const salesPoints = [
    {
      id: 1,
      code: "DB001",
      name: "Cửa hàng phụ tùng 365",
      address: "36 Đường 3/2, Phường 12, Quận 10, TP.HCM",
      area: "Khu vực 1",
      manager: "Nguyễn Văn A",
    },
    {
      id: 2,
      code: "DB002",
      name: "Gara Ô tô Minh Tuấn",
      address: "Cầu Giấy, Hà Nội",
      area: "Khu vực 2",
      manager: "Trần Thị B",
    },
    {
      id: 3,
      code: "DB003",
      name: "Đại lý ô tô Hoàng An",
      address: "123 Đường 1, Quận 1, TP.HCM",
      area: "Khu vực 1",
      manager: "Lê Văn C",
    },
    {
      id: 4,
      code: "DB004",
      name: "Cửa hàng phụ tùng ABC",
      address: "456 Đường Lê Lợi, Quận 1, TP.HCM",
      area: "Khu vực 3",
      manager: "Phạm Thị D",
    },
    {
      id: 5,
      code: "DB005",
      name: "Gara Xe Máy XYZ",
      address: "789 Đường Nguyễn Trãi, Quận 5, TP.HCM",
      area: "Khu vực 2",
      manager: "Hoàng Văn E",
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSalesPoints = salesPoints.slice(startIndex, endIndex);

  return (
    <Card>
      <CardContent>
        <TableUI>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-10">STT</TableHead>
              <TableHead className="text-left">Mã điểm bán</TableHead>
              <TableHead className="text-left">Tên cửa hàng</TableHead>
              <TableHead className="text-left">Địa chỉ</TableHead>
              <TableHead className="text-left">Khu vực</TableHead>
              <TableHead className="text-left">Quản lý</TableHead>
              <TableHead className="text-left w-32">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSalesPoints.map((point, index) => (
              <TableRow key={point.id}>
                <TableCell className="text-center w-10">{startIndex + index + 1}</TableCell>
                <TableCell>{point.code}</TableCell>
                <TableCell>{point.name}</TableCell>
                <TableCell>
                  <span className="text-sm">{point.address}</span>
                </TableCell>
                <TableCell>{point.area}</TableCell>
                <TableCell>{point.manager}</TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Link href={`/sales-points/${point.id}`}>
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
          totalItems={salesPoints.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  )
}


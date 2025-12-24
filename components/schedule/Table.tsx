"use client"

import { useState } from "react";
import { Eye, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Status, StatusBadge } from "../ui/status-badge";
import { Table as TableUI, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Link from "next/link";

export function Table() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const surveys = [
    {
      id: 1,
      store: {
        name: "Cửa hàng phụ tùng 365",
        address: "36 Đường 3/2, Phường 12, Quận 10, TP.HCM",
      },
      assignee: {
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0912345678",
      },
      status: Status.COMPLETED,
      dueDate: new Date(),
    },
    {
      id: 2,
      store: {
        name: "Gara Ô tô Minh Tuấn",
        address: "Cầu Giấy, Hà Nội",
      },
      assignee: {
        name: "Nguyễn Văn B",
        email: "nguyenvanb@gmail.com",
        phone: "0912345679",
      },
      status: Status.OVERDUE,
      dueDate: new Date(),
    },
    {
      id: 3,
      store: {
        name: "Đại lý ô tô Hoàng An",
        address: "123 Đường 1, Quận 1, TP.HCM",
      },
      assignee: {
        name: "Nguyễn Văn C",
        email: "nguyenvanc@gmail.com",
        phone: "0912345678",
      },
      status: Status.IN_PROGRESS,
      dueDate: new Date(),
    },
    {
      id: 4,
      store: {
        name: "Cửa hàng phụ tùng 365",
        address: "36 Đường 3/2, Phường 12, Quận 10, TP.HCM",
      },
      assignee: {
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0912345678",
      },
      requestSurvey: {
        status: Status.PENDING,
      },
      status: Status.IN_PROGRESS,
      dueDate: new Date(),
    },
  ]

  const totalPages = Math.ceil(surveys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurveys = surveys.slice(startIndex, endIndex);
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, surveys.length);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Card>
      <CardContent>
        <TableUI>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-10">STT</TableHead>
              <TableHead className="text-left">Cửa hàng</TableHead>
              <TableHead className="text-left">Nhân viên</TableHead>
              <TableHead className="text-left">Trạng thái</TableHead>
              <TableHead className="text-left">Thời gian</TableHead>
              <TableHead className="text-left w-32">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSurveys.map((survey, index) => (
              <TableRow key={index}>
                <TableCell className="text-center w-10">{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{survey.store.name}</span>
                    <span className="text-xs text-muted-foreground">{survey.store.address}</span>
                  </div>
                </TableCell>
                <TableCell>{survey.assignee.name}</TableCell>
                <TableCell><StatusBadge status={survey.requestSurvey?.status || survey.status} /></TableCell>
                <TableCell>{survey.dueDate.toLocaleDateString()}</TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Link href={`/schedule/${survey.id}`}>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground w-full sm:w-auto">
            Hiển thị {startItem} đến {endItem} trong tổng số {surveys.length} mục
          </div>
          <Pagination className="w-full sm:w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { TablePagination } from "../ui/table-pagination";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearStaffsState, deleteUser, getUsers } from "@/features/staffs/staffs.slice";
import { getRoleLabel, getStatusLabel, isActiveStatus, generateStaffCode } from "@/model/User.model";
import { useDialog } from "@/hooks/use-dialog";
import { Skeleton } from "../ui/skeleton";

export function Table() {
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showInfo, showLoading } = useDialog();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const staffs = useAppSelector((state) => state.staffs.staffs);
  const filter = useAppSelector((state) => state.staffs.filter);
  const requestState = useAppSelector((state) => state.staffs.requestState);

  const isLoading = requestState.status === 'loading' && requestState.type === 'getUsers';

  useEffect(() => {
    dispatch(getUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    return () => {
      dispatch(clearStaffsState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search, filter.role, filter.status]);

  const filteredStaffs = staffs.filter((staff) => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const nameMatch = staff.name?.toLowerCase().includes(searchLower);
      const emailMatch = staff.email?.toLowerCase().includes(searchLower);
      const phoneMatch = staff.phone?.toLowerCase().includes(searchLower);
      if (!nameMatch && !emailMatch && !phoneMatch) {
        return false;
      }
    }

    if (filter.role) {
      if (!staff.roles || !staff.roles.includes(filter.role)) {
        return false;
      }
    }

    if (filter.status) {
      if (staff.status !== filter.status) {
        return false;
      }
    }

    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaffs = filteredStaffs.slice(startIndex, endIndex);

  const handleDeleteStaff = (id: string) => {
    showInfo({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn xóa nhân viên này không?",
      onConfirm() {
        dispatch(deleteUser(id));
      },
    });
  }

  useEffect(() => {
    if (!requestState.type) return;
    if (['deleteUser'].includes(requestState.type)) {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: "Nhân viên đã được xóa thành công.",
            onConfirm() {
              dispatch(getUsers());
              setCurrentPage(1);
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi xóa nhân viên",
            description: requestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              dispatch(getUsers());
            },
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          });
          break;
      }
    }
  }, [requestState]);

  return (
    <Card className="flex flex-col flex-1 min-h-0 pb-0!">
      <CardHeader>
        <CardTitle>Danh sách nhân viên</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden min-h-0">
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="border-b px-4">
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-10">STT</TableHead>
                  <TableHead className="text-left w-30">Mã nhân viên</TableHead>
                  <TableHead className="text-left flex-1">Tên nhân viên</TableHead>
                  <TableHead className="text-left w-64">Email</TableHead>
                  <TableHead className="text-left w-32">Số điện thoại</TableHead>
                  <TableHead className="text-left w-48">Vai trò</TableHead>
                  <TableHead className="text-left w-32">Trạng thái</TableHead>
                  <TableHead className="text-center w-24"></TableHead>
                </TableRow>
              </TableHeader>
            </table>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full caption-bottom text-sm">
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell className="text-center w-10">
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell className="text-left w-30">
                        <Skeleton className="h-4 w-30" />
                      </TableCell>
                      <TableCell className="text-left flex-1">
                        <Skeleton className="h-4 w-full flex-1" />
                      </TableCell>
                      <TableCell className="text-left w-64">
                        <Skeleton className="h-4 w-64" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-left w-48">
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-center w-24">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))) : (currentStaffs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentStaffs.map((staff, index) => (
                      <TableRow key={staff.id}>
                        <TableCell className="text-center w-10">{startIndex + index + 1}</TableCell>
                        <TableCell className="text-left w-30">{generateStaffCode(staff.id, index)}</TableCell>
                        <TableCell className="text-left flex-1">{staff.name}</TableCell>
                        <TableCell className="text-left w-64">{staff.email || "-"}</TableCell>
                        <TableCell className="text-left w-32">{staff.phone || "-"}</TableCell>
                        <TableCell className="text-left w-48">{getRoleLabel(staff.roles)}</TableCell>
                        <TableCell className="text-left w-32">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActiveStatus(staff.status)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}>
                            {getStatusLabel(staff.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center w-24">
                          <div className="flex flex-row gap-2 justify-center">
                            <Link href={`/staffs/${staff.id}`}>
                              <Button variant="outline" size="icon">
                                <Eye className="size-4 text-blue-500" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteStaff(staff.id)}>
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </table>
          </div>
          <div className="border-t p-0!">
            <TablePagination
              currentPage={currentPage}
              totalItems={filteredStaffs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


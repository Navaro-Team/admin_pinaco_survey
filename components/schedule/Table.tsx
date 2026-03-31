"use client"

import { useEffect, useRef } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changePage, getTasks, resetPagination } from "@/features/schedule/schedule.slice";
import { StatusBadge } from "../ui/status-badge";
import { formatDate, isSameDay } from "date-fns";
import { TablePagination } from "../ui/table-pagination";
import { Skeleton } from "../ui/skeleton";
import { useDialog } from "@/hooks/use-dialog";
import { deleteTask } from "@/features/schedule/schedule.slice";

export function Table() {
  const dispatch = useAppDispatch();
  const { showInfo, showSuccess, showFailed, showLoading } = useDialog();
  const tasks = useAppSelector((state) => state.schedule.tasks);
  const filter = useAppSelector((state) => state.schedule.filter);
  const pagination = useAppSelector((state) => state.schedule.pagination);
  const requestState = useAppSelector((state) => state.schedule.requestState);
  const isLoading = requestState.status === 'loading' && requestState.type === 'getTasks' && requestState.data !== true;

  const isInitialMount = useRef(true);
  const prevTasksLengthRef = useRef(tasks.length);
  const prevFilterRef = useRef({
    q: filter.q,
    assigneeId: filter.assigneeId,
    deadline: filter.deadline,
    status: filter.status,
  });

  const getTasksParams = (page: number) => ({
    page,
    limit: 10,
    q: filter.q?.trim() || undefined,
    assigneeId: filter.assigneeId?.trim() || undefined,
    status: filter.status || undefined,
  });

  const fetchTasks = (page: number) => {
    dispatch(getTasks(getTasksParams(page)));
  };

  // Load data when filter changes or on initial mount
  useEffect(() => {
    const prevDeadline = prevFilterRef.current.deadline;
    const currentDeadline = filter.deadline;

    const deadlineChanged =
      prevDeadline !== currentDeadline &&
      (
        (prevDeadline && currentDeadline && !isSameDay(prevDeadline, currentDeadline)) ||
        (!prevDeadline && currentDeadline) ||
        (prevDeadline && !currentDeadline)
      );

    const filterChanged =
      prevFilterRef.current.q !== filter.q ||
      prevFilterRef.current.assigneeId !== filter.assigneeId ||
      deadlineChanged ||
      prevFilterRef.current.status !== filter.status;

    if (isInitialMount.current || filterChanged) {
      isInitialMount.current = false;
      prevFilterRef.current = {
        q: filter.q,
        assigneeId: filter.assigneeId,
        deadline: filter.deadline,
        status: filter.status,
      };
      dispatch(resetPagination());
      fetchTasks(1);
    }
  }, [dispatch, filter.q, filter.assigneeId, filter.deadline, filter.status]);

  // Reload when tasks become empty after having data (e.g., after back from detail page)
  useEffect(() => {
    const tasksBecameEmpty = prevTasksLengthRef.current > 0 && tasks.length === 0;
    if (!isInitialMount.current && tasksBecameEmpty && !isLoading && requestState.status !== 'loading') {
      dispatch(resetPagination());
      fetchTasks(1);
    }
    prevTasksLengthRef.current = tasks.length;
  }, [dispatch, tasks.length, isLoading, requestState.status, filter.q, filter.assigneeId, filter.status]);

  const filteredTasks = tasks.filter((task) => {
    if (filter.deadline && filter.deadline instanceof Date) {
      if (task.dueDate) {
        const taskDueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
        if (!isSameDay(taskDueDate, filter.deadline)) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  });

  const itemsPerPage = 10;

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1;
    dispatch(changePage(nextPage));
    fetchTasks(nextPage);
  };

  const handlePageChange = (page: number) => {
    const neededItems = page * itemsPerPage;

    if (tasks.length < neededItems && pagination.hasMore) {
      const nextPageToLoad = Math.floor(tasks.length / 20) + 1;
      fetchTasks(nextPageToLoad);
    }

    dispatch(changePage(page));
  };

  const handleDeleteTask = (id: string) => {
    showInfo({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn xóa khảo sát này không?",
      onConfirm() {
        dispatch(deleteTask(id));
      },
    });
  }

  const startIndex = (pagination.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayTasks = filteredTasks.slice(startIndex, endIndex);


  useEffect(() => {
    if (!requestState.type) return;
    if (['deleteTask'].includes(requestState.type)) {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: "Khảo sát đã được xóa thành công.",
            onConfirm() {
              dispatch(getTasks());
              dispatch(resetPagination());
              fetchTasks(1);
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi xóa khảo sát",
            description: requestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              dispatch(getTasks());
              dispatch(resetPagination());
              fetchTasks(1);
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
        <CardTitle>Danh sách khảo sát</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden min-h-0">
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="border-b px-4">
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-10">STT</TableHead>
                  <TableHead className="text-left flex-1">Cửa hàng</TableHead>
                  <TableHead className="text-left w-48">Nhân viên</TableHead>
                  <TableHead className="text-left w-32">Trạng thái</TableHead>
                  <TableHead className="text-left w-32">Thời gian</TableHead>
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
                      <TableCell className="text-left flex-1">
                        <Skeleton className="h-4 w-full flex-1" />
                      </TableCell>
                      <TableCell className="text-left w-48">
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-center w-24">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))) : (displayTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không có dữ liệu hiển thị
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayTasks.map((task, index) => {
                      const actualIndex = startIndex + index + 1;
                      return (
                        <TableRow key={task._id}>
                          <TableCell className="text-center w-10">{actualIndex}</TableCell>
                          <TableCell className="text-left flex-1">
                            <div className="flex flex-col gap-1">
                              <span>{task.store?.name || "-"}</span>
                              {task.store?.location?.address && (
                                <span className="text-xs text-muted-foreground">{task.store.location.address}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-left w-48">{task.assignee?.name || "-"}</TableCell>
                          <TableCell className="text-left w-32">
                            <StatusBadge status={task.submission ? task.submission.status : task.status} />
                          </TableCell>
                          <TableCell className="text-left w-32">
                            {task.dueDate ? formatDate(new Date(task.completedAt ?? task.createdAt), 'dd/MM/yyyy') : "-"}
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex flex-row gap-2 justify-center">
                              <Link href={`/schedule/${task._id}`}>
                                <Button variant="outline" size="icon">
                                  <Eye className="size-4 text-blue-500" />
                                </Button>
                              </Link>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteTask(task._id)}>
                                <Trash2 className="size-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ))}
              </TableBody>
            </table>
          </div>
          <TablePagination
            currentPage={pagination.page}
            totalItems={filteredTasks.length}
            itemsPerPage={itemsPerPage}
            hasMore={pagination.hasMore}
            onLoadMore={handleLoadMore}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}

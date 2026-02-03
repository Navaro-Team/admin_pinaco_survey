"use client"

import { useEffect, useRef } from "react";
import { Eye } from "lucide-react";
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

export function Table() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((state) => state.schedule.tasks);
  const filter = useAppSelector((state) => state.schedule.filter);
  const pagination = useAppSelector((state) => state.schedule.pagination);
  const requestState = useAppSelector((state) => state.schedule.requestState);
  const isLoading = requestState.status === 'loading' && requestState.type === 'getTasks' && requestState.data !== true;

  const isInitialMount = useRef(true);
  const prevTasksLengthRef = useRef(tasks.length);
  const prevFilterRef = useRef({
    store: filter.store,
    area: filter.area,
    region: filter.region,
    deadline: filter.deadline,
    status: filter.status,
  });

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
      prevFilterRef.current.store !== filter.store ||
      prevFilterRef.current.area !== filter.area ||
      prevFilterRef.current.region !== filter.region ||
      deadlineChanged ||
      prevFilterRef.current.status !== filter.status;

    if (isInitialMount.current || filterChanged) {
      isInitialMount.current = false;
      prevFilterRef.current = {
        store: filter.store,
        area: filter.area,
        region: filter.region,
        deadline: filter.deadline,
        status: filter.status,
      };
    dispatch(resetPagination());
      dispatch(getTasks({ page: 1, limit: 20, status: filter.status || undefined }));
    }
  }, [dispatch, filter.store, filter.area, filter.region, filter.deadline, filter.status]);

  // Reload when tasks become empty after having data (e.g., after back from detail page)
  useEffect(() => {
    const tasksBecameEmpty = prevTasksLengthRef.current > 0 && tasks.length === 0;
    if (!isInitialMount.current && tasksBecameEmpty && !isLoading && requestState.status !== 'loading') {
    dispatch(resetPagination());
      dispatch(getTasks({ page: 1, limit: 20, status: filter.status || undefined }));
    }
    prevTasksLengthRef.current = tasks.length;
  }, [dispatch, tasks.length, isLoading, requestState.status, filter.status]);

  const filteredTasks = tasks.filter((task) => {
    // Filter by store (search in store name)
    if (filter.store) {
      const storeLower = filter.store.toLowerCase();
      const storeNameMatch = task.store?.name?.toLowerCase().includes(storeLower);
      if (!storeNameMatch) {
        return false;
      }
    }

    // Filter by deadline (compare dueDate with filter deadline)
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

    if (filter.status) {
      if (task.status !== filter.status) {
        return false;
      }
    }

    return true;
  });

  const handleLoadMore = () => {
    dispatch(changePage(pagination.page + 1));
    dispatch(getTasks({ page: pagination.page + 1, limit: 20 }));
  };

  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    const neededItems = page * itemsPerPage;

    if (tasks.length < neededItems && pagination.hasMore) {
      const itemsNeeded = neededItems - tasks.length;
      const batchesNeeded = Math.ceil(itemsNeeded / 20);

      if (batchesNeeded > 0) {
        dispatch(getTasks({ page: 1, limit: 20 }));
      }
    }

    dispatch(changePage(page));
  };
  const startIndex = (pagination.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayTasks = filteredTasks.slice(startIndex, endIndex);

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
                            <StatusBadge status={task.status} />
                          </TableCell>
                          <TableCell className="text-left w-32">
                            {task.dueDate ? formatDate(new Date(task.dueDate), 'dd/MM/yyyy') : "-"}
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex flex-row gap-2 justify-center">
                              <Link href={`/schedule/${task._id}`}>
                                <Button variant="outline" size="icon">
                                  <Eye className="size-4 text-blue-500" />
                                </Button>
                              </Link>
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
            totalItems={tasks.length}
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

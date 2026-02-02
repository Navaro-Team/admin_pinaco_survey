import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "../ui/card";
import { StatusBadge } from "../ui/status-badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { getTasks } from "@/features/task/task.slice";
import { Task } from "@/model/Task.model";
import { formatUTCDate } from "@/lib/utils";

export function RecentActivity() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state: any) => state.task.tasks);

  useEffect(() => {
    dispatch(getTasks({ page: 1, limit: 10 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="@container/card gap-4! py-4! flex flex-col flex-1">
      <CardHeader className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>{tasks.length} khảo sát mới nhất được gửi về</CardDescription>
        </div>
        <CardAction className="flex items-center gap-1">
          <Link href="/schedule" className="text-sm text-main hover:text-main/80">Xem tất cả</Link>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-row items-center gap-1 text-sm">
        <Table>
          <TableCaption hidden>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">STT</TableHead>
              <TableHead className="text-left">Cửa hàng</TableHead>
              <TableHead className="text-left">Nhân viên</TableHead>
              <TableHead className="text-left">Trạng thái</TableHead>
              <TableHead className="text-left">Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task: Task, index: number) => (
              <TableRow key={task._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium flex flex-col gap-1">
                  <span>{task.store.name}</span>
                  <span className="text-xs text-muted-foreground">{task.store.address}</span>
                </TableCell>
                <TableCell>{task.assignee.name}</TableCell>
                <TableCell><StatusBadge status={task.status} /></TableCell>
                <TableCell className="text-left">{formatUTCDate(task.createdAt, 'dd/MM/yyyy')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}
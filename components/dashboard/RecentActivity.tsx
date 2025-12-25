import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "../ui/card";
import { Status, StatusBadge } from "../ui/status-badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function RecentActivity() {
  const activities = [
    {
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
      createdAt: new Date(),
    },
    {
      store: {
        name: "Gara Ô tô Minh Tuấn",
        address: "Cầu Giấy, Hà Nội",
      },
      assignee: {
        name: "Nguyễn Văn B",
        email: "nguyenvanb@gmail.com",
        phone: "0912345679",
      },
      status: Status.COMPLETED,
      createdAt: new Date(),
    },
    {
      store: {
        name: "Đại lý ô tô Hoàng An",
        address: "123 Đường 1, Quận 1, TP.HCM",
      },
      assignee: {
        name: "Nguyễn Văn C",
        email: "nguyenvanc@gmail.com",
        phone: "0912345678",
      },
      status: Status.COMPLETED,
      createdAt: new Date(),
    }
  ]

  return (
    <Card className="@container/card gap-4! py-4! flex-3/5">
      <CardHeader className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>5 khảo sát mới nhất được gửi về</CardDescription>
        </div>
        <CardAction className="flex items-center gap-1">
          <Link href="/recent-activity" className="text-sm text-main hover:text-main/80">Xem tất cả</Link>
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
            {activities.map((activity, index) => (
              <TableRow key={activity.store.name}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium flex flex-col gap-1">
                  <span>{activity.store.name}</span>
                  <span className="text-xs text-muted-foreground">{activity.store.address}</span>
                </TableCell>
                <TableCell>{activity.assignee.name}</TableCell>
                <TableCell><StatusBadge status={activity.status} /></TableCell>
                <TableCell className="text-left">{activity.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}
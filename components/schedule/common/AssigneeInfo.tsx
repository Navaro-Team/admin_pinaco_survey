import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatUTCDate } from "@/lib/utils";
import { LogIn, LogOut, UserIcon } from "lucide-react";
import Image from "next/image";
import { Task } from "@/model/Task.model";

interface AssigneeInfoProps {
  task: Task | null;
  submittedAt?: string;
  checkinTime?: string;
  checkoutTime?: string;
}

export function AssigneeInfo({ task, submittedAt, checkinTime, checkoutTime }: AssigneeInfoProps) {
  return (
    <Card className="flex flex-col gap-4!">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <UserIcon className="size-6 text-main" />
          <span>Thông tin người khảo sát</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col py-2! gap-4">
        <div className="flex flex-row gap-4">
          <Image src="/images/assignee.png"
            alt="Assignee"
            width={100}
            height={100}
            className="rounded-full border border-dotted" />
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">{task?.assignee?.name ?? "N/A"}</Label>
            <span className="text-sm text-muted-foreground">{task?.assignee?.email ?? "N/A"}</span>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Số điện thoại</Label>
            <span className="text-lg font-medium">{task?.assignee?.phone ?? "N/A"}</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Ngày thực hiện</Label>
            <span className="text-lg font-medium">{submittedAt ? formatUTCDate(submittedAt, 'dd/MM/yyyy') : "N/A"}</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground"><LogIn className="size-4 text-green-500" /> Check in</Label>
            <span className="text-lg font-medium">{checkinTime ? formatUTCDate(checkinTime, 'HH:mm') : "N/A"}</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground"><LogOut className="size-4 text-red-500" /> Check out</Label>
            <span className="text-lg font-medium">{checkoutTime ? formatUTCDate(checkoutTime, 'HH:mm') : "N/A"}</span>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}
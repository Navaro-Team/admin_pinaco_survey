import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "date-fns";
import { LogIn, LogOut, UserIcon } from "lucide-react";
import Image from "next/image";

export function AssigneeInfo() {
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
            <Label className="text-lg font-medium">Nguyễn Văn A</Label>
            <span className="text-sm text-muted-foreground">Nhân viên thị trường - Khu vực 1</span>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Ngày thực hiện</Label>
            <span className="text-lg font-medium">{formatDate(new Date(), 'dd/MM/yyyy')}</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Mã nhân viên</Label>
            <span className="text-lg font-medium">NV001</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground"><LogIn className="size-4 text-green-500" /> Check in</Label>
            <span className="text-lg font-medium">10:00 AM</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground"><LogOut className="size-4 text-red-500" /> Check out</Label>
            <span className="text-lg font-medium">11:00 AM</span>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}
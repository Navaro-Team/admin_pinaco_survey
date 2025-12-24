import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StoreIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export function StoreInfo() {
  return (
    <Card className="flex flex-col gap-4!">
      <CardHeader className="h-8">
        <CardTitle className="flex flex-row items-center gap-2">
          <StoreIcon className="size-6 text-main" />
          <span>Thông tin cửa hàng</span>
        </CardTitle>
        <CardAction>
          <Link href={`/store/1`}>
            <Button variant="ghost" className="text-main cursor-pointer">
              Xem chi tiết
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-row py-2! gap-4">
        <Image src="/images/store.png" alt="Store" width={224} height={224} className="rounded-md border border-dotted" />
        <div className="flex flex-col gap-2">
          <div>
            <Label className="text-sm text-muted-foreground">Tên cửa hàng</Label>
            <span className="text-lg font-medium">Cửa hàng phụ tùng 365</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Địa chỉ</Label>
            <span className="text-lg font-medium">36 Đường 3/2, Phường 12, Quận 10, TP.HCM</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Người liên hệ</Label>
            <span className="text-lg font-medium">Nguyễn Thị Minh</span>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Số điện thoại</Label>
            <span className="text-lg font-medium">0912345678</span>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}
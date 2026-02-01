import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StoreIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Store } from "@/model/Store.model";

interface StoreInfoProps {
  store: Store;
  isLoading: boolean;
}

export function StoreInfo({ store, isLoading }: StoreInfoProps) {
  return (
    <Card className="flex flex-col gap-4!">
      <CardHeader className="h-8">
        <CardTitle className="flex flex-row items-center gap-2">
          <StoreIcon className="size-6 text-main" />
          <span>Thông tin cửa hàng</span>
        </CardTitle>
        <CardAction>
          <Link href={`/sales-points/${store?.id}`}>
            <Button variant="ghost" className="text-main cursor-pointer">
              Xem chi tiết
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-row py-2! gap-4">
        <Image src="/images/store.png" alt="Store" width={224} height={224} className="rounded-md border border-dotted w-56 h-56" />
        <div className="flex flex-col gap-2">
          <div>
            <Label className="text-sm text-muted-foreground">Tên cửa hàng</Label>
            {isLoading ? <Skeleton className="w-full h-4" /> : <span className="text-lg font-medium">{store?.name ?? "N/A"}</span>}
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Địa chỉ</Label>
            {isLoading ? <Skeleton className="w-full h-4" /> : <span className="text-lg font-medium">{store?.location?.address ?? "N/A"}</span>}
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Người liên hệ</Label>
            {isLoading ? <Skeleton className="w-full h-4" /> : <span className="text-lg font-medium">{store?.contactPersonName ?? "N/A"}</span>}
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Số điện thoại</Label>
            {isLoading ? <Skeleton className="w-full h-4" /> : <span className="text-lg font-medium">{store?.phone ?? "N/A"}</span>}
          </div>
        </div>
      </CardContent>
    </Card >
  )
}
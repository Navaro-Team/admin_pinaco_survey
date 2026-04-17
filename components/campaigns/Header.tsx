"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import CampaignsSheet from "./CampaignsSheet";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Danh sách chiến dịch</h1>
          <p className="text-base text-muted-foreground">Quản lý và chỉnh sửa thông tin chiến dịch</p>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Link href="#" onClick={() => setIsSheetOpen(true)}>
            <Button className="bg-main text-white hover:bg-main/90">
              <Plus className="size-4" />
              Tạo
            </Button>
          </Link>
        </div>
      </div>
      <CampaignsSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  )
}


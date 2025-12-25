"use client"

import { useParams } from "next/navigation";
import { StaffForm } from "@/components/staffs/StaffForm";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const isEdit = id && id !== "new";

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Chỉnh sửa nhân sự" : "Tạo nhân sự mới"}
          </h1>
          <p className="text-base text-muted-foreground">
            {isEdit ? "Cập nhật thông tin nhân sự" : "Thêm nhân sự mới vào hệ thống"}
          </p>
        </div>
      </div>
      <StaffForm id={isEdit ? id : undefined} />
    </div>
  )
}


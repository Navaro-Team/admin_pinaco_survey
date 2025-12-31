"use client"

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeAction, getUserById } from "@/features/staffs/staffs.slice";
import { StaffForm } from "@/components/staffs/StaffForm";

export default function Page() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const id = params?.id as string;
  const action = useAppSelector((state) => state.staffs.action);

  useEffect(() => {
    if (id === "new") {
      dispatch(changeAction("INS"));
    } else if (id) {
      dispatch(getUserById(id));
      dispatch(changeAction("UPD"));
    }
  }, [id, dispatch]);

  const getTitle = () => {
    switch (action) {
      case "INS":
        return "Tạo nhân sự mới";
      case "UPD":
        return "Chỉnh sửa nhân sự";
      case "VIE":
        return "Xem chi tiết nhân sự";
      default:
        return "Tạo nhân sự mới";
    }
  };

  const getDescription = () => {
    switch (action) {
      case "INS":
        return "Thêm nhân sự mới vào hệ thống";
      case "UPD":
        return "Cập nhật thông tin nhân sự";
      case "VIE":
        return "Xem thông tin chi tiết nhân sự";
      default:
        return "Thêm nhân sự mới vào hệ thống";
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            {getTitle()}
          </h1>
          <p className="text-base text-muted-foreground">
            {getDescription()}
          </p>
        </div>
      </div>
      <StaffForm />
    </div>
  )
}


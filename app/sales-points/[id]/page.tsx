"use client"

import { useParams } from "next/navigation";
import { SalesPointForm } from "@/components/sales-points/SalesPointForm";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { getStoreById, clearSalesPointsState } from "@/features/sales-points/sales-points.slice";

export default function Page() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const id = params?.id as string;
  const isEdit = !!id && id !== "new";

  useEffect(() => {
    dispatch(clearSalesPointsState());

    if (id && isEdit) {
      dispatch(getStoreById(id));
    }

    return () => {
      dispatch(clearSalesPointsState());
    };
  }, [id, dispatch, isEdit]);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Chỉnh sửa điểm bán" : "Tạo điểm bán mới"}
          </h1>
          <p className="text-base text-muted-foreground">
            {isEdit ? "Cập nhật thông tin điểm bán" : "Thêm điểm bán mới vào hệ thống"}
          </p>
        </div>
      </div>
      <SalesPointForm isEdit={isEdit} />
    </div>
  )
}


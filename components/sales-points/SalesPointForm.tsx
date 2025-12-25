"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SalesPointFormData, salesPointSchema } from "@/features/sales-points/sales-points.schema";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";

interface SalesPointFormProps {
  id?: string;
}

export function SalesPointForm({ id }: SalesPointFormProps) {
  const router = useRouter();
  const isEdit = !!id;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SalesPointFormData>({
    resolver: zodResolver(salesPointSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      salesScale: "",
      contactName: "",
      phone: "",
      sellerName: "",
      supplierCode: "",
      supplierName: "",
    },
  });

  // Load data nếu là edit mode
  useEffect(() => {
    if (isEdit && id) {
      // TODO: Fetch data từ API
      // const fetchData = async () => {
      //   const data = await getSalesPoint(id);
      //   reset(data);
      // };
      // fetchData();
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: SalesPointFormData) => {
    try {
      // TODO: Call API để tạo hoặc cập nhật
      // if (isEdit) {
      //   await updateSalesPoint(id, data);
      // } else {
      //   await createSalesPoint(data);
      // }
      console.log("Form data:", data);

      // Redirect về trang danh sách
      router.push("/sales-points");
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="px-6 py-0!">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên điểm bán */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Tên điểm bán</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    className={`bg-gray-100 text-black opacity-100 ${errors.name ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập tên điểm bán"
                  />
                )}
              />
              {errors.name && (
                <FieldError errors={[errors.name]} />
              )}
            </div>

            {/* Mã điểm bán */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Mã điểm bán</Label>
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập mã điểm bán"
                  />
                )}
              />
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-sm text-gray-500">Địa chỉ</Label>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Input
                    className={`bg-gray-100 text-black opacity-100 ${errors.address ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập địa chỉ"
                  />
                )}
              />
              {errors.address && (
                <FieldError errors={[errors.address]} />
              )}
            </div>

            {/* Quy mô doanh số */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Quy mô doanh số</Label>
              <Controller
                control={control}
                name="salesScale"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập quy mô doanh số"
                  />
                )}
              />
            </div>

            {/* Tên người liên hệ */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Tên người liên hệ</Label>
              <Controller
                control={control}
                name="contactName"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập tên người liên hệ"
                  />
                )}
              />
            </div>

            {/* Số điện thoại điểm bán */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Số điện thoại điểm bán</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập số điện thoại"
                  />
                )}
              />
            </div>

            {/* Tên nhân viên bán hàng */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Tên nhân viên bán hàng</Label>
              <Controller
                control={control}
                name="sellerName"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập tên nhân viên bán hàng"
                  />
                )}
              />
            </div>

            {/* Mã NPP */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Mã NPP</Label>
              <Controller
                control={control}
                name="supplierCode"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập mã NPP"
                  />
                )}
              />
            </div>

            {/* Tên NPP */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Tên NPP</Label>
              <Controller
                control={control}
                name="supplierName"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập tên NPP"
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-row justify-between items-center mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/sales-points")}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-main text-white hover:bg-main/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Đang xử lý...
              </>
            ) : (
              isEdit ? "Cập nhật" : "Tạo mới"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}


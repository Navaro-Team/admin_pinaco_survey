"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputCalendar } from "@/components/ui/InputCalendar";
import { Combobox } from "@/components/ui/combobox";
import { StaffFormData, staffSchema } from "@/features/staffs/staffs.schema";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";

interface StaffFormProps {
  id?: string;
}

export function StaffForm({ id }: StaffFormProps) {
  const router = useRouter();
  const isEdit = !!id;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: null,
      address: "",
      gender: "",
      role: "",
    },
  });

  // Load data nếu là edit mode
  useEffect(() => {
    if (isEdit && id) {
      // TODO: Fetch data từ API
      // const fetchData = async () => {
      //   const data = await getStaff(id);
      //   reset({
      //     ...data,
      //     dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      //   });
      // };
      // fetchData();
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: StaffFormData) => {
    try {
      // TODO: Call API để tạo hoặc cập nhật
      // if (isEdit) {
      //   await updateStaff(id, data);
      // } else {
      //   await createStaff(data);
      // }
      console.log("Form data:", data);

      // Redirect về trang danh sách
      router.push("/staffs");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const roleOptions = [
    { value: "admin", label: "Quản trị viên" },
    { value: "manager", label: "Quản lý" },
    { value: "staff", label: "Nhân viên" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="px-6 py-0!">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và tên */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Họ và tên</Label>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <Input
                    className={`bg-gray-100 text-black opacity-100 ${errors.fullName ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập họ và tên"
                  />
                )}
              />
              {errors.fullName && (
                <FieldError errors={[errors.fullName]} />
              )}
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Số điện thoại</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    className={`bg-gray-100 text-black opacity-100 ${errors.phone ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập số điện thoại"
                  />
                )}
              />
              {errors.phone && (
                <FieldError errors={[errors.phone]} />
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    type="email"
                    className={`bg-gray-100 text-black opacity-100 ${errors.email ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập email"
                  />
                )}
              />
              {errors.email && (
                <FieldError errors={[errors.email]} />
              )}
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Ngày sinh</Label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <InputCalendar
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    placeholder="Chọn ngày sinh"
                    inputFormat="dd/MM/yyyy"
                  />
                )}
              />
              {errors.dateOfBirth && (
                <FieldError errors={[errors.dateOfBirth]} />
              )}
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-sm text-gray-500">Địa chỉ</Label>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Input
                    className="bg-gray-100 text-black opacity-100"
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

            {/* Giới tính */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Giới tính</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Combobox
                    options={genderOptions}
                    value={field.value || ""}
                    placeholder="Chọn giới tính"
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
              {errors.gender && (
                <FieldError errors={[errors.gender]} />
              )}
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Vai trò</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Combobox
                    options={roleOptions}
                    value={field.value || ""}
                    placeholder="Chọn vai trò"
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
              {errors.role && (
                <FieldError errors={[errors.role]} />
              )}
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
            onClick={() => router.push("/staffs")}
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


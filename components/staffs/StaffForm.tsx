"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputCalendar } from "@/components/ui/InputCalendar";
import { Combobox } from "@/components/ui/combobox";
import { StaffFormData, staffFormSchema } from "@/features/staffs/staffs.schema";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getUserById, createUser, updateUser, clearStaffsState } from "@/features/staffs/staffs.slice";
import { useDialog } from "@/hooks/use-dialog";

export function StaffForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { showSuccess, showFailed, showInfo, showLoading } = useDialog();

  const action = useAppSelector((state) => state.staffs.action);
  const requestState = useAppSelector((state) => state.staffs.requestState);
  const selectedStaff = useAppSelector((state) => state.staffs.selectedStaff);

  const isEdit = action === "UPD";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    mode: "onBlur", // Validate on blur
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      dateOfBirth: undefined,
      address: "",
      gender: null,
      password: "",
      roles: [],
      status: "active",
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        try {
          setIsLoadingData(true);
          await dispatch(getUserById(selectedStaff?.id || ""));
        } catch (err) {
          showFailed({
            title: "Lỗi khi lấy dữ liệu nhân sự",
            description: (err as any)?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              router.push("/staffs");
              dispatch(clearStaffsState());
              setIsLoadingData(false);
            },
            onCancel() {
              router.push("/staffs");
              dispatch(clearStaffsState());
              setIsLoadingData(false);
            },
          });
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, dispatch]);

  useEffect(() => {
    if (selectedStaff && isEdit) {
      reset({
        name: selectedStaff.name || "",
        phone: selectedStaff.phone || "",
        email: selectedStaff.email || "",
        dateOfBirth: selectedStaff.dateOfBirth
          ? new Date(selectedStaff.dateOfBirth)
          : undefined,
        address: selectedStaff.address || "",
        gender: selectedStaff.gender || null,
        password: "",
        roles: selectedStaff.roles || [],
        status: (selectedStaff.status as "active" | "inactive" | "suspended" | "banned" | "deleted" | "locked" | "requires_re_authentication") || "active",
      });
    } else if (!isEdit) {
      reset({
        name: "",
        phone: "",
        email: "",
        dateOfBirth: undefined,
        address: "",
        gender: null,
        password: "",
        roles: [],
        status: "active",
      });
    }
  }, [selectedStaff, isEdit, reset]);

  const onSubmit = async (data: StaffFormData) => {
    // Trigger validation for all fields before submit
    const isValid = await trigger();
    if (!isValid) {
      // Form has validation errors, React Hook Form will prevent submit
      return;
    }

    let authMethod: 'email' | 'phone' | undefined;
    if (data.email && data.email.trim() !== '') {
      authMethod = 'email';
    } else if (data.phone && data.phone.trim() !== '') {
      authMethod = 'phone';
    }

    const submitData: any = {
      name: data.name ? data.name.trim() : undefined,
      email: data.email && data.email.trim() !== '' ? data.email.trim() : undefined,
      phone: data.phone && data.phone.trim() !== '' ? data.phone.trim() : undefined,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : undefined,
      address: data.address && data.address.trim() !== '' ? data.address.trim() : undefined,
      gender: data.gender || undefined,
      roles: data.roles && data.roles.length > 0 ? data.roles : undefined,
      status: data.status || undefined,
    };

    if (authMethod) {
      submitData.authMethod = authMethod;
    }

    if (data.password && data.password.trim() !== "") {
      submitData.password = data.password;
    }

    showInfo({
      title: "Xác nhận",
      description: isEdit ? "Bạn có chắc chắn muốn cập nhật nhân sự này không?" : "Bạn có chắc chắn muốn tạo nhân sự mới không?",
      onConfirm() {
        if (isEdit) {
          dispatch(updateUser({ id: selectedStaff?.id || "", data: submitData }));
        } else {
          dispatch(createUser(submitData));
        }
      },
    });
  };

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const roleOptions = [
    { value: "admin", label: "Quản trị viên" },
    { value: "manager", label: "Quản lý" },
    { value: "officer", label: "Nhân viên" },
    { value: "sales", label: "Nhân viên bán hàng" },
  ];

  const statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Không hoạt động" },
    { value: "suspended", label: "Bị đình chỉ" },
    { value: "banned", label: "Bị cấm" },
    { value: "locked", label: "Bị khóa" },
  ];

  useEffect(() => {
    if (!requestState.type) return;
    if (['createUser', 'updateUser', 'deleteUser'].includes(requestState.type)) {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: isEdit ? "Nhân sự đã được cập nhật thành công." : "Nhân sự đã được tạo thành công.",
            onConfirm() {
              router.push("/staffs");
              dispatch(clearStaffsState());
              setIsLoadingData(false);
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi " + (isEdit ? "cập nhật" : "tạo") + " nhân sự",
            description: requestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              router.push("/staffs");
              dispatch(clearStaffsState());
              setIsLoadingData(false);
            },
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          });
          break;
      }
    }
  }, [requestState, dispatch])

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="size-6" />
      </div>
    );
  }

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
                name="name"
                render={({ field }) => (
                  <Input
                    className={`bg-gray-100 text-black opacity-100 ${errors.name ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập họ và tên"
                  />
                )}
              />
            </div>

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
                    placeholder="Nhập số điện thoại (0xxxxxxxxx)"
                  />
                )}
              />
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
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">
                Mật khẩu {!isEdit && <span className="text-red-500">*</span>}
                {isEdit && <span className="text-xs text-gray-400">(Để trống nếu không đổi)</span>}
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    type="password"
                    className={`bg-gray-100 text-black opacity-100 ${errors.password ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={isEdit ? "Nhập mật khẩu mới (tối thiểu 6 ký tự)" : "Nhập mật khẩu (tối thiểu 6 ký tự)"}
                  />
                )}
              />
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Vai trò</Label>
              <Controller
                control={control}
                name="roles"
                render={({ field }) => {
                  const selectedRole = Array.isArray(field.value) && field.value.length > 0
                    ? field.value[0]
                    : "";
                  return (
                    <Combobox
                      options={roleOptions}
                      value={selectedRole}
                      placeholder="Chọn vai trò"
                      onChange={(value) => {
                        field.onChange(value ? [value] : []);
                      }}
                      className="w-full"
                    />
                  );
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Trạng thái</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Combobox
                    options={statusOptions}
                    value={field.value || "active"}
                    placeholder="Chọn trạng thái"
                    onChange={field.onChange}
                    className="w-full"
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


"use client"

import { useEffect, useMemo } from "react";
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
import { initialValues, SalesPointFormData, salesPointSchema } from "@/features/sales-points/sales-points.schema";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useDialog } from "@/hooks/use-dialog";
import { clearSalesPointsState, createStore, updateStore } from "@/features/sales-points/sales-points.slice";

interface SalesPointFormProps {
  isEdit: boolean;
}

export function SalesPointForm({ isEdit }: SalesPointFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showInfo, showLoading } = useDialog();
  const store = useAppSelector((state) => state.salesPoints.store);
  const requestState = useAppSelector((state) => state.salesPoints.requestState);

  const defaultValues = useMemo(() => {
    if (store) {
      return {
        name: store?.name || "",
        code: store?.code || "",
        address: store?.location?.address || "",
        salesScale: store?.salesScale || 0,
        contactPersonName: store?.contactPersonName || "",
        phone: store?.phone || "",
        supplierCode: store?.nppCode || "",
        supplierName: store?.nppName || "",
        sellerName: store?.salesEmployeeName || "",
      };
    }

    return initialValues;
  }, [store, isEdit]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SalesPointFormData>({
    resolver: zodResolver(salesPointSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEdit && store) {
      reset(defaultValues);
    } else if (!isEdit) {
      reset(initialValues);
    }
  }, [store, isEdit, reset]);

  const onSubmit = async (data: SalesPointFormData) => {
    try {
      const payload = {
        name: data.name,
        code: data.code,
        address: data.address,
        salesScale: data.salesScale,
        contactPersonName: data.contactPersonName,
        phone: data.phone,
        nppCode: data.supplierCode,
        nppName: data.supplierName,
        salesEmployeeName: data.sellerName,
        province: store?.province || "",
        area: store?.area || "",
        locationId: store?.locationId || "",
        type: store?.type || "",
        location: store?.location || {},
      };
      showInfo({
        title: "Xác nhận",
        description: isEdit ? "Bạn có chắc chắn muốn cập nhật điểm bán này không?" : "Bạn có chắc chắn muốn tạo điểm bán mới không?",
        onConfirm: async () => {
          if (isEdit) {
            await dispatch(updateStore({ id: store?.id || "", data: payload }));
          } else {
            await dispatch(createStore(payload));
          }
        },
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (!requestState.type) return;
    if (['updateStore', 'createStore'].includes(requestState.type)) {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: isEdit ? "Điểm bán đã được cập nhật thành công." : "Điểm bán đã được tạo thành công.",
            onConfirm() {
              dispatch(clearSalesPointsState());
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi " + (isEdit ? "cập nhật" : "tạo") + " điểm bán",
            description: requestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              router.push("/sales-points");
              dispatch(clearSalesPointsState());
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
  }, [requestState, dispatch, router, isEdit, showSuccess, showFailed, showLoading]);

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
                    value={field.value?.toFixed(2) || ""}
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
                name="contactPersonName"
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


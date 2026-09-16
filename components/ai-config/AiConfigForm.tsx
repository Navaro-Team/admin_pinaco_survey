"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { AiConfigFormData, aiConfigFormSchema } from "@/features/ai-config/ai-config.schema";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearAiConfigState, updateAiConfig } from "@/features/ai-config/ai-config.slice";
import { useDialog } from "@/hooks/use-dialog";

export function AiConfigForm() {
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showInfo, showLoading } = useDialog();

  const config = useAppSelector((state) => state.aiConfig.config);
  const requestState = useAppSelector((state) => state.aiConfig.requestState);
  const isLoadingConfig = requestState.type === "getAiConfig" && requestState.status === "loading";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AiConfigFormData>({
    resolver: zodResolver(aiConfigFormSchema),
    mode: "onBlur",
    defaultValues: {
      modelName: "",
      apiKey: "",
      isActive: true,
      rpmLimit: 5,
      rpdLimit: 20,
    },
  });

  useEffect(() => {
    if (config) {
      reset({
        modelName: config.modelName || "",
        apiKey: "",
        isActive: config.isActive,
        rpmLimit: config.rpmLimit || 5,
        rpdLimit: config.rpdLimit || 20,
      });
    }
  }, [config, reset]);

  const onSubmit = async (data: AiConfigFormData) => {
    const submitData: {
      provider: string;
      modelName: string;
      apiKey?: string;
      isActive: boolean;
      rpmLimit: number;
      rpdLimit: number;
    } = {
      provider: "gemini",
      modelName: data.modelName.trim(),
      isActive: data.isActive,
      rpmLimit: data.rpmLimit,
      rpdLimit: data.rpdLimit,
    };

    if (data.apiKey && data.apiKey.trim() !== "") {
      submitData.apiKey = data.apiKey.trim();
    }

    showInfo({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn lưu cấu hình AI này không? Thay đổi có hiệu lực ngay cho các lượt phân loại tiếp theo.",
      onConfirm() {
        dispatch(updateAiConfig(submitData));
      },
    });
  };

  useEffect(() => {
    if (requestState.type !== "updateAiConfig") return;
    switch (requestState.status) {
      case "completed":
        showSuccess({
          title: "Thành công",
          description: "Cấu hình AI đã được lưu thành công.",
          onConfirm() {
            dispatch(clearAiConfigState());
          },
        });
        break;
      case "failed":
        showFailed({
          title: "Lỗi khi lưu cấu hình AI",
          description: requestState.error?.replace("body.body:", "") || "Có lỗi xảy ra. Vui lòng thử lại.",
          onConfirm() {
            dispatch(clearAiConfigState());
          },
        });
        break;
      case "loading":
        showLoading({
          title: "Đang xử lý",
          description: "Vui lòng chờ trong giây lát...",
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestState.type, requestState.status]);

  if (isLoadingConfig) {
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
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Nhà cung cấp AI</Label>
              <Input
                className="bg-gray-100 text-black opacity-100"
                value="Google Gemini"
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">
                Model <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="modelName"
                render={({ field }) => (
                  <Input
                    className={`bg-gray-100 text-black opacity-100 ${errors.modelName ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Ví dụ: gemini-3.6-flash"
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-sm text-gray-500">
                API Key
                <span className="text-xs text-gray-400 ml-1">
                  {config?.apiKey ? `(Hiện tại: ${config.apiKey} — để trống nếu không đổi)` : "(Chưa cấu hình)"}
                </span>
              </Label>
              <Controller
                control={control}
                name="apiKey"
                render={({ field }) => (
                  <Input
                    type="password"
                    className={`bg-gray-100 text-black opacity-100 ${errors.apiKey ? "border-destructive" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập API key mới"
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">
                Giới hạn request/phút (RPM) <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="rpmLimit"
                render={({ field }) => (
                  <Input
                    type="number"
                    min={1}
                    className={`bg-gray-100 text-black opacity-100 ${errors.rpmLimit ? "border-destructive" : ""}`}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    onBlur={field.onBlur}
                    placeholder="5"
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">
                Giới hạn request/ngày (RPD) <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="rpdLimit"
                render={({ field }) => (
                  <Input
                    type="number"
                    min={1}
                    className={`bg-gray-100 text-black opacity-100 ${errors.rpdLimit ? "border-destructive" : ""}`}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    onBlur={field.onBlur}
                    placeholder="20"
                  />
                )}
              />
              <p className="text-xs text-gray-400">
                Bộ máy phân loại nền sẽ tự động tạm dừng khi hết quota trong ngày và tự tiếp tục sau khi quota được làm mới.
              </p>
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                )}
              />
              <Label className="text-sm text-gray-500">Bật phân loại AI cho báo cáo Câu 16</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
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
              "Lưu cấu hình"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

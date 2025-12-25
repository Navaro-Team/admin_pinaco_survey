"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getQuestionById, updateQuestion } from "@/features/questions/questions.slice";
import { Spinner } from "../ui/spinner";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { InputCalendar } from "../ui/InputCalendar";
import { Button } from "../ui/button";
import { getQuestionTypeLabel } from "@/features/questions/questions.constants";
import { clientService } from "@/features/http/ClientService";

interface QuestionDetailSheetProps {
  questionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuestionFormData {
  title: string;
  instruction: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface SKU {
  brandCode: string;
  brandName: string;
  batteryTypeCode: string;
  batteryTypeName: string;
  sku: string;
  purpose: string;
}

export function QuestionDetailSheet({
  questionId,
  open,
  onOpenChange,
}: QuestionDetailSheetProps) {
  const dispatch = useAppDispatch();
  const selectedQuestion = useAppSelector((state) => state.questions.selectedQuestion);
  const requestState = useAppSelector((state) => state.questions.requestState);
  const [skus, setSkus] = useState<SKU[]>([]);
  const [isLoadingSkus, setIsLoadingSkus] = useState(false);

  const isLoading = requestState.status === 'loading' && requestState.type === 'getQuestionById';
  const isUpdating = requestState.status === 'loading' && requestState.type === 'updateQuestion';

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<QuestionFormData>({
    defaultValues: {
      title: '',
      instruction: '',
      createdAt: null,
      updatedAt: null,
    },
  });

  useEffect(() => {
    if (open && questionId) {
      dispatch(getQuestionById(questionId));
    }
  }, [dispatch, open, questionId]);

  useEffect(() => {
    const fetchSKUs = async () => {
      if (selectedQuestion?.source === 'sources.skus') {
        setIsLoadingSkus(true);
        try {
          const response = await clientService.get('/sources/skus');
          const responseData = response?.data?.data?.data || response?.data?.data || response?.data;
          setSkus(responseData?.skus || []);
        } catch (error) {
          console.error('Failed to fetch SKUs:', error);
          setSkus([]);
        } finally {
          setIsLoadingSkus(false);
        }
      } else {
        setSkus([]);
      }
    };

    if (selectedQuestion) {
      fetchSKUs();
    }
  }, [selectedQuestion]);

  useEffect(() => {
    if (selectedQuestion) {
      reset({
        title: selectedQuestion.title || '',
        instruction: selectedQuestion.instruction || '',
        createdAt: selectedQuestion.createdAt ? new Date(selectedQuestion.createdAt) : null,
        updatedAt: selectedQuestion.updatedAt ? new Date(selectedQuestion.updatedAt) : null,
      });
    }
  }, [selectedQuestion, reset]);

  const onSubmit = async (data: QuestionFormData) => {
    if (!questionId || !selectedQuestion) return;

    try {
      await dispatch(updateQuestion({
        id: questionId,
        data: {
          title: data.title,
          instruction: data.instruction,
          createdAt: data.createdAt?.toISOString(),
          updatedAt: data.updatedAt?.toISOString(),
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col gap-2">
        <SheetHeader className="pb-0!">
          <SheetTitle>Chi tiết câu hỏi</SheetTitle>
          <SheetDescription hidden>Thông tin chi tiết về câu hỏi</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </div>
          ) : selectedQuestion ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Mã câu hỏi</h3>
                  <p className="text-base font-semibold">{selectedQuestion.code}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2">Tiêu đề</Label>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="mt-2"
                        placeholder="Nhập tiêu đề câu hỏi"
                      />
                    )}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Loại câu hỏi</h3>
                  <Badge variant="outline">{getQuestionTypeLabel(selectedQuestion.questionType)}</Badge>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2">Hướng dẫn</Label>
                  <Controller
                    control={control}
                    name="instruction"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className="mt-2 min-h-[100px]"
                        placeholder="Nhập hướng dẫn cho câu hỏi"
                      />
                    )}
                  />
                </div>

                {selectedQuestion.source && selectedQuestion.source !== 'sources.skus' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Nguồn</h3>
                      <p className="text-base">{selectedQuestion.source}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Validation Rules */}
              {selectedQuestion.validation && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quy tắc xác thực</h3>
                    <div className="space-y-2">
                      {selectedQuestion.validation.required !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Bắt buộc:</span>
                          <Badge variant={selectedQuestion.validation.required ? "default" : "secondary"}>
                            {selectedQuestion.validation.required ? "Có" : "Không"}
                          </Badge>
                        </div>
                      )}
                      {selectedQuestion.validation.minValue !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Giá trị tối thiểu:</span>
                          <span className="text-sm">{selectedQuestion.validation.minValue}</span>
                        </div>
                      )}
                      {selectedQuestion.validation.allowDecimals !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Cho phép số thập phân:</span>
                          <Badge variant={selectedQuestion.validation.allowDecimals ? "default" : "secondary"}>
                            {selectedQuestion.validation.allowDecimals ? "Có" : "Không"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Scale */}
              {selectedQuestion.scale && selectedQuestion.scale.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Thang đo</h3>
                    <div className="space-y-2">
                      {selectedQuestion.scale.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-2 border rounded-md">
                          <span className="text-sm font-medium w-12">{item.value}</span>
                          <span className="text-sm flex-1">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Items */}
              {selectedQuestion.items && selectedQuestion.items.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Các lựa chọn</h3>
                    <div className="space-y-2">
                      {selectedQuestion.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-2 border rounded-md">
                          <span className="text-sm font-medium w-12">{item.code}</span>
                          <span className="text-sm flex-1">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* File Count */}
              {selectedQuestion.fileCount !== undefined && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Số lượng file</h3>
                    <p className="text-base">{selectedQuestion.fileCount}</p>
                  </div>
                </>
              )}

              {/* Status */}
              <Separator />
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Trạng thái</h3>
                    <Badge variant={selectedQuestion.status === 'active' ? "default" : "secondary"}>
                      {selectedQuestion.status === 'active' ? "Hoạt động" : "Đã xóa"}
                    </Badge>
                  </div>
                  {selectedQuestion.isActive !== undefined && (
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Đang kích hoạt</h3>
                      <Badge variant={selectedQuestion.isActive ? "default" : "secondary"}>
                        {selectedQuestion.isActive ? "Có" : "Không"}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Sources.SKUs */}
              {selectedQuestion.source === 'sources.skus' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Sources.SKUs</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Câu hỏi này sử dụng dữ liệu từ sources.skus để hiển thị danh sách SKU.
                      </p>
                      <div className="p-3 border rounded-md bg-muted/50">
                        <p className="text-sm font-medium mb-1">Source Reference:</p>
                        <code className="text-xs text-muted-foreground">{selectedQuestion.source}</code>
                      </div>
                      <div className="mt-4 hidden">
                        <p className="text-sm font-medium mb-2">Danh sách SKU:</p>
                        {isLoadingSkus ? (
                          <div className="flex items-center justify-center py-4">
                            <Spinner className="size-4" />
                          </div>
                        ) : skus.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                            <div className="grid grid-cols-5 gap-2 font-medium mb-2 pb-2 border-b text-xs">
                              <span>Brand Code</span>
                              <span>Brand Name</span>
                              <span>Battery Type</span>
                              <span>SKU</span>
                              <span>Purpose</span>
                            </div>
                            {skus.map((sku, index) => (
                              <div key={index} className="grid grid-cols-5 gap-2 text-xs py-1 border-b last:border-0">
                                <span>{sku.brandCode}</span>
                                <span>{sku.brandName}</span>
                                <span>{sku.batteryTypeName}</span>
                                <span>{sku.sku}</span>
                                <span>{sku.purpose}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 border rounded-md text-sm text-muted-foreground">
                            Không có dữ liệu SKU
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Timestamps */}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Ngày tạo</Label>
                  <Controller
                    control={control}
                    name="createdAt"
                    render={({ field }) => (
                      <InputCalendar
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder="Chọn ngày tạo"
                        inputFormat="dd/MM/yyyy"
                        disabled={true}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Ngày cập nhật</Label>
                  <Controller
                    control={control}
                    name="updatedAt"
                    render={({ field }) => (
                      <InputCalendar
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder="Chọn ngày cập nhật"
                        inputFormat="dd/MM/yyyy"
                        disabled={true}
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Không tìm thấy thông tin câu hỏi</p>
            </div>
          )}
        </div>
        <Separator />
        {selectedQuestion && (
          <SheetFooter className="flex-row justify-end gap-2 pt-2!">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-main hover:bg-main/90"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isUpdating}>
              {isSubmitting || isUpdating ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Đang lưu...
                </>
              ) : (
                'Lưu'
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}


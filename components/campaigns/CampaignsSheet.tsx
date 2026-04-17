import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { InputCalendar } from "../ui/InputCalendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { Campaign } from "@/model/Campaign.model";
import { CAMPAIGN_STATUS, CAMPAIGN_STATUS_LABELS, CampaignStatus } from "@/lib/campaigns.utils";
import { Combobox } from "../ui/combobox";
import { useDialog } from "@/hooks/use-dialog";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createCampaign, updateCampaign } from "@/features/campaigns/campaigns.slice";

interface CampaignsSheetProps {
  open: boolean;
  campaign?: Campaign | null;
  onOpenChange: (open: boolean) => void;
}

interface CampaignFormData {
  campaignName: string;
  areas: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  status: CampaignStatus;
}

export default function CampaignsSheet(props: CampaignsSheetProps) {
  const { open, campaign, onOpenChange } = props;
  const dispatch = useAppDispatch();
  const requestState = useAppSelector((state) => state.campaigns.requestState);
  const { showWarning } = useDialog();
  const { control, reset, watch, handleSubmit } = useForm<CampaignFormData>({
    defaultValues: {
      campaignName: "",
      areas: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      description: "",
      status: CAMPAIGN_STATUS.DRAFT,
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      campaignName: campaign?.campaignName || "",
      areas: campaign?.areas?.join(", ") || "",
      startDate: campaign?.startDate ? new Date(campaign.startDate) : new Date(),
      endDate: campaign?.endDate ? new Date(campaign.endDate) : new Date(new Date().setDate(new Date().getDate() + 30)),
      description: campaign?.description || "",
      status: campaign?.status as CampaignStatus || CAMPAIGN_STATUS.DRAFT,
    });
  }, [campaign, open, reset]);

  const startDate = watch("startDate");

  const onSubmit = handleSubmit((data) => {
    const payload = {
      campaignName: data.campaignName,
      areas: data.areas.split(",").map((area) => area.trim()),
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      status: data.status,
    }
    if (campaign) {
      dispatch(updateCampaign({ id: campaign._id, data: payload }));
    } else {
      dispatch(createCampaign(payload));
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col gap-2">
        <SheetHeader className="pb-0!">
          <SheetTitle>{campaign ? "Cập nhật chiến dịch" : "Tạo chiến dịch"}</SheetTitle>
          <SheetDescription hidden>Thông tin chi tiết về chiến dịch</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto px-4">
          <form className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Tên chiến dịch</Label>
              <Controller
                control={control}
                name="campaignName"
                render={({ field }) => (
                  <Input {...field} className="mt-2" placeholder="Nhập tên chiến dịch" />
                )}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Khu vực</Label>
              <Controller
                control={control}
                name="areas"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="mt-2 min-h-[90px]"
                    placeholder="Nhập các khu vực, phân tách bằng dấu phẩy"
                  />
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Ngày bắt đầu</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <InputCalendar
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholder="Chọn ngày bắt đầu"
                      inputFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Ngày kết thúc</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <InputCalendar
                      value={field.value}
                      onChange={(date) => {
                        if (date && startDate && date <= startDate) {
                          showWarning({
                            title: 'Cảnh báo',
                            description: 'Ngày kết thúc phải sau ngày bắt đầu',
                            confirmText: 'Đồng ý',
                            cancelText: 'Hủy',
                            onConfirm: () => field.onChange(new Date(new Date().setDate(new Date().getDate() + 1))),
                            onCancel: () => field.onChange(new Date(new Date().setDate(new Date().getDate() + 1))),
                          });
                        } else {
                          field.onChange(date);
                        }
                      }}
                      placeholder="Chọn ngày kết thúc"
                      inputFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Mô tả</Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="mt-2 min-h-[120px]"
                    placeholder="Nhập mô tả chiến dịch"
                  />
                )}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Trạng thái</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Combobox
                    className="w-full"
                    options={Object.values(CAMPAIGN_STATUS).map((status) => ({
                      value: status,
                      label: CAMPAIGN_STATUS_LABELS[status as CampaignStatus],
                    }))}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>
          </form>
        </div>
        <Separator />
        <SheetFooter className="flex-row justify-end gap-2 pt-2!">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            type="button"
            variant="default"
            className="bg-main hover:bg-main/90"
            onClick={onSubmit}>
            {requestState.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : campaign ? "Cập nhật" : "Tạo"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
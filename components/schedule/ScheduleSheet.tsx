"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { createMultipleTasks } from "@/features/task/task.slice";
import { changeCampaign } from "@/features/campaigns/campaigns.slice";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { Campaign } from "@/model/Campaign.model";
import { changeSurvey } from "@/features/survey/survey.slice";
import { Survey } from "@/model/Survey.model";
import { useDialog } from "@/hooks/use-dialog";

interface ScheduleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleSheet({
  open,
  onOpenChange,
}: ScheduleSheetProps) {
  const dispatch = useAppDispatch();
  const { showWarning, showInfo } = useDialog();
  const taskState = useAppSelector((state) => state.task.requestState);
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const campaign = useAppSelector((state) => state.campaigns.campaign);
  const surveys = useAppSelector((state) => state.survey.surveys);
  const survey = useAppSelector((state) => state.survey.survey);

  const handleChangeCampaign = (value: string) => {
    const selectedCampaign = campaigns.find((campaign: Campaign) => campaign?._id === value);
    if (selectedCampaign) {
      dispatch(changeCampaign(selectedCampaign));
    } else {
      dispatch(changeCampaign(null));
    }
  };

  const handleChangeSurvey = (value: string) => {
    const selectedSurvey = surveys.find((survey: Survey) => survey?._id === value);
    if (selectedSurvey) {
      dispatch(changeSurvey(selectedSurvey));
    } else {
      dispatch(changeSurvey(null));
    }
  };

  const handleCreateMultipleTasks = () => {
    if (!campaign?._id) {
      showWarning({ title: 'Cảnh báo', description: 'Vui lòng chọn chiến dịch' });
      return;
    }

    if (!survey?._id) {
      showWarning({ title: 'Cảnh báo', description: 'Vui lòng chọn khảo sát' });
      return;
    }

    showInfo({
      title: 'Thông báo', description: 'Bạn có chắc chắn muốn tạo lịch trình khảo sát không?',
      confirmText: 'Tạo lịch trình',
      cancelText: 'Hủy',
      onCancel: () => onOpenChange(false),
      onConfirm: () => {
        dispatch(createMultipleTasks({
          surveyId: survey?._id || '',
          campaignId: campaign?._id || '',
          dueDate: campaign?.endDate || new Date().toISOString()
        }));
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col gap-2">
        <SheetHeader className="pb-0!">
          <SheetTitle>Tạo lịch trình</SheetTitle>
          <SheetDescription hidden>Thông tin chi tiết về lịch trình</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 flex flex-col gap-2 px-3">
          {/* Combobox Chiến dịch */}
          <div className="flex flex-row gap-2">
            <Label htmlFor="campaignId" className="text-sm w-1/4">
              Chiến dịch <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={campaigns.map(campaign => ({
                value: campaign._id,
                label: campaign.campaignName,
              }))}
              value={campaign?._id || ""}
              onChange={handleChangeCampaign}
              placeholder="Chọn chiến dịch"
              className="w-3/4"
            />
          </div>

          {/* Combobox Khảo sát */}
          <div className="flex flex-row gap-2 justify-between">
            <Label htmlFor="surveyId" className="text-sm w-1/4">
              Khảo sát <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={surveys?.map((survey: Survey) => ({
                value: survey._id,
                label: survey?.surveyData?.title,
              })) || []}
              value={survey?._id || ""}
              onChange={handleChangeSurvey}
              placeholder="Chọn khảo sát"
              className="w-3/4"
            />
          </div>
        </div>
        <Separator />

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
            onClick={handleCreateMultipleTasks}
            disabled={taskState.type === 'createMultipleTasks' && taskState.status === 'loading'}>
            Tạo lịch trình
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}


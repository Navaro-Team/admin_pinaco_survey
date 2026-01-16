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
import { clearTaskState, createTask } from "@/features/task/task.slice";
import { changeCampaign } from "@/features/campaigns/campaigns.slice";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { SearchableCombobox } from "../ui/searchable-combobox";
import { Campaign } from "@/model/Campaign.model";
import { changeSurvey } from "@/features/survey/survey.slice";
import { Survey } from "@/model/Survey.model";
import { useDialog } from "@/hooks/use-dialog";
import { changeStaff, searchUsers } from "@/features/staffs/staffs.slice";
import { User } from "@/model/User.model";
import { Store } from "@/model/Store.model";
import { changeStore, searchStores } from "@/features/store/store.slice";

interface AssignSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignSheet({
  open,
  onOpenChange,
}: AssignSheetProps) {
  const dispatch = useAppDispatch();
  const { showWarning, showInfo } = useDialog();
  const taskState = useAppSelector((state) => state.task.requestState);
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const campaign = useAppSelector((state) => state.campaigns.campaign);
  const surveys = useAppSelector((state) => state.survey.surveys);
  const survey = useAppSelector((state) => state.survey.survey);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const staff = useAppSelector((state) => state.staffs.staff);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);
  const stores = useAppSelector((state) => state.store.stores);
  const store = useAppSelector((state) => state.store.store);
  const storesRequestState = useAppSelector((state) => state.store.requestState);

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

  const handleChangeStaff = (value: string) => {
    const selectedStaff = staffs.find((staff: User) => staff?.id === value);
    if (selectedStaff) {
      dispatch(changeStaff(selectedStaff));
    } else {
      dispatch(changeStaff(null));
    }
  };

  const handleChangeStore = (value: string) => {
    const selectedStore = stores.find((store: Store) => store?.id === value);
    if (selectedStore) {
      dispatch(changeStore(selectedStore));
    } else {
      dispatch(changeStore(null));
    }
  };

  const handleSearchStaffs = (searchValue: string) => {
    const trimmedSearch = searchValue.trim();
    const params: any = {
      page: 1,
    };

    if (trimmedSearch) {
      params.q = trimmedSearch;
    } else {
      params.limit = 50;
    }

    dispatch(searchUsers(params));
  };

  const handleSearchStores = (searchValue: string) => {
    const trimmedSearch = searchValue.trim();
    const params: any = {
      page: 1,
    };

    if (trimmedSearch) {
      params.q = trimmedSearch;
    } else {
      params.limit = 50;
    }

    dispatch(searchStores(params));
  };

  const handleCreateTask = () => {
    if (!campaign?._id) {
      showWarning({ title: 'Cảnh báo', description: 'Vui lòng chọn chiến dịch' });
      return;
    }

    if (!survey?._id) {
      showWarning({ title: 'Cảnh báo', description: 'Vui lòng chọn khảo sát' });
      return;
    }

    if (!staff?.id) {
      showWarning({ title: 'Cảnh báo', description: 'Vui lòng chọn nhân viên' });
      return;
    }

    if (!store?.id) {
      showWarning({ title: 'Cảnh báo', description: 'Vui lòng chọn cửa hàng' });
      return;
    }

    showInfo({
      title: 'Thông báo', description: 'Bạn có chắc chắn muốn tạo lịch trình khảo sát không?',
      confirmText: 'Tạo lịch trình',
      cancelText: 'Hủy',
      onCancel: () => onOpenChange(false),
      onConfirm: () => {
        dispatch(createTask({
          surveyId: survey?._id || '',
          assignee: {
            id: staff?.id || '',
            name: staff?.name || '',
            email: staff?.email || '',
            phone: staff?.phone || '',
          },
          storeId: store?.id || '',
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
          <SheetTitle>Gán lịch trình</SheetTitle>
          <SheetDescription hidden>Thông tin chi tiết về gán lịch trình</SheetDescription>
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

          {/* Combobox Nhân viên */}
          <div className="flex flex-row gap-2 justify-between">
            <Label htmlFor="staffId" className="text-sm w-1/4">
              Nhân viên <span className="text-red-500">*</span>
            </Label>
            <SearchableCombobox
              options={staffs.map(staff => ({
                value: staff.id,
                label: [staff.code, staff.name].filter(Boolean).join(' - '),
              }))}
              value={staff?.id || ""}
              onChange={handleChangeStaff}
              placeholder="Chọn nhân viên"
              className="w-3/4"
              isLoading={staffsRequestState.status === 'loading' && staffsRequestState.type === 'searchUsers'}
              onSearch={handleSearchStaffs}
            />
          </div>

          {/* Combobox Cửa hàng */}
          <div className="flex flex-row gap-2 justify-between">
            <Label htmlFor="storeId" className="text-sm w-1/4">
              Cửa hàng <span className="text-red-500">*</span>
            </Label>
            <SearchableCombobox
              options={stores.map(store => ({
                value: store.id,
                label: [store.code, store.name].filter(Boolean).join(' - '),
              }))}
              value={store?.id || ""}
              onChange={handleChangeStore}
              placeholder="Chọn cửa hàng"
              className="w-3/4"
              isLoading={storesRequestState.status === 'loading' && storesRequestState.type === 'searchStores'}
              onSearch={handleSearchStores}
            />
          </div>
        </div>
        <Separator />

        <SheetFooter className="flex-row justify-end gap-2 pt-2!">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              dispatch(clearTaskState());
            }}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="default"
            className="bg-main hover:bg-main/90"
            onClick={handleCreateTask}
            disabled={taskState.type === 'createTask' && taskState.status === 'loading'}>
            Tạo lịch trình
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}


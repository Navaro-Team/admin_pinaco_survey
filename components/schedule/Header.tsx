import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button } from "../ui/button";
import { CalendarPlus2, RefreshCcw, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDialog } from "@/hooks/use-dialog";
import { ScheduleSheet } from "./ScheduleSheet";
import { clearSurveyState, getSurveys } from "@/features/survey/survey.slice";
import { clearCampaignsState, getCampaigns } from "@/features/campaigns/campaigns.slice";
import { AssignSheet } from "./AssignSheet";
import { clearStaffsState, searchUsers } from "@/features/staffs/staffs.slice";
import { clearStoreState, searchStores } from "@/features/store/store.slice";
import { ExportExcelPopover } from "./ExportExcelPopover";
import { clearFilter, clearScheduleState, getTasks, resetPagination } from "@/features/schedule/schedule.slice";

export function Header() {
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showLoading } = useDialog();
  const taskState = useAppSelector((state) => state.task.requestState);
  const [openScheduleSheet, setOpenScheduleSheet] = useState<boolean>(false);
  const [openAssignSheet, setOpenAssignSheet] = useState<boolean>(false);

  const handleRefresh = () => {
    dispatch(clearFilter());
    dispatch(resetPagination());
    dispatch(getTasks({ page: 1, limit: 20 }));
  }

  const clearState = () => {
    dispatch(clearScheduleState());
    dispatch(clearSurveyState());
    dispatch(clearCampaignsState());
    dispatch(clearStaffsState());
    dispatch(clearStoreState());
    dispatch(getTasks({ page: 1, limit: 20 }));
  }

  useEffect(() => {
    if (!taskState.type) return;
    if (['createMultipleTasks', 'createTask'].includes(taskState.type)) {
      switch (taskState.status) {
        case 'completed':
          showSuccess({
            title: 'Thành công',
            description: 'Lịch trình khảo sát đã được tạo thành công',
            onCancel: () => {
              clearState();
              dispatch(getTasks({ page: 1, limit: 20 }));
              setOpenScheduleSheet(false);
              setOpenAssignSheet(false);
            },
            onConfirm: () => {
              clearState();
              dispatch(getTasks({ page: 1, limit: 20 }));
              setOpenScheduleSheet(false);
              setOpenAssignSheet(false);
            }
          });
          break;
        case 'failed':
          showFailed({
            title: 'Thất bại',
            description: 'Lịch trình khảo sát đã được tạo thất bại',
            onCancel: () => { },
            onConfirm: () => { }
          });
          break;
        case 'loading':
          showLoading({ title: 'Đang xử lý', description: 'Vui lòng chờ trong giây lát' });
          break;
      }
    }
  }, [taskState]);

  useEffect(() => {
    dispatch(getCampaigns());
    dispatch(getSurveys({}));
    dispatch(searchUsers({ page: 1, limit: 50 }));
    dispatch(searchStores({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (!openScheduleSheet || openAssignSheet) {
      clearState();
    }
  }, [openScheduleSheet, openAssignSheet]);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Quản lý lịch trình khảo sát</h1>
        <p className="text-base text-muted-foreground">Xem, lọc và quản lý danh sách các lịch trình khảo sát tại điểm bán</p>
      </div>
      <div className="flex flex-col gap-4 items-center lg:flex-row">
        <ExportExcelPopover />
        <Button variant="outline" onClick={() => setOpenScheduleSheet(true)}>
          <CalendarPlus2 />
          Tạo lịch trình
        </Button>
        <Button variant="outline" onClick={() => setOpenAssignSheet(true)}>
          <UserPlus />
          Gán lịch trình
        </Button>
        <Button variant="outline" className="h-10 w-full md:w-10" onClick={handleRefresh}>
          <RefreshCcw className="size-4" />
        </Button>
      </div>
      <ScheduleSheet open={openScheduleSheet} onOpenChange={setOpenScheduleSheet} />
      <AssignSheet open={openAssignSheet} onOpenChange={setOpenAssignSheet} />
    </div>
  )
}
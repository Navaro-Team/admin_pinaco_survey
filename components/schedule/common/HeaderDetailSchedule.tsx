"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Status } from "@/components/ui/status-badge";
import { useToastContext } from "@/context/ToastContext";
import { clearFilter, getTaskById } from "@/features/schedule/schedule.slice";
import { approveResurveyRequest, rejectResurveyRequest } from "@/features/survey/survey.slice";
import { cancelTask, clearTaskState } from "@/features/task/task.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useDialog } from "@/hooks/use-dialog";
import { exportSurveyToPDF } from "@/utils/pdf-export";
import { ArrowLeftIcon, CircleCheckBig, CircleX, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function HeaderDetailSchedule() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.schedule.task);
  const survey = useAppSelector((state) => state.survey.survey);
  const submission = useAppSelector((state) => state.submission.submission);
  const requestState = useAppSelector((state) => state.survey.requestState);
  const isLoading = requestState.status === 'loading';

  const isApproved = requestState.type === 'approveResurveyRequest';
  const isReject = requestState.type === 'rejectResurveyRequest';
  const taskState = useAppSelector(state => state.task.requestState);
  const { error, success } = useToastContext();
  const { showSuccess, showFailed, showDialog, showLoading } = useDialog();
  const noteRef = useRef<string>("");

  const handleExportPDF = () => {
    if (!survey || !task) {
      return;
    }
    exportSurveyToPDF(survey, submission, task);
  }

  const handleAcceptRequest = async () => {
    await dispatch(approveResurveyRequest(task?.resurveyRequestId ?? ''))
      .unwrap()
      .then(() => {
        dispatch(getTaskById(task?._id ?? ''));
        setTimeout(() => {
          success('Thành công', 'Yêu cầu hỗ trợ đã được chấp nhận');
          dispatch(clearTaskState());
        }, 500);
      })
      .catch((err: any) => {
        const payload = err as any;
        error('Thất bại', payload.message);
      });
  }

  const handleRejectRequest = async () => {
    await dispatch(rejectResurveyRequest(task?.resurveyRequestId ?? ''))
      .unwrap()
      .then(() => {
        dispatch(getTaskById(task?._id ?? ''));
        setTimeout(() => {
          success('Thành công', 'Yêu cầu hỗ trợ đã được từ chối');
          dispatch(clearTaskState());
        }, 500);
      })
      .catch((err: any) => {
        const payload = err as any;
        error('Thất bại', payload.message);
      });
  }

  const handleCancelTask = () => {
    noteRef.current = "";
    showDialog(
      "custom",
      {
        title: "Huỷ khảo sát",
        content: <div className="flex flex-col gap-2">
          <Label className="text-sm text-gray-500">Lý do</Label>
          <Input
            className="bg-gray-100 text-black opacity-100"
            placeholder="Vui lòng nhập lý do"
            onChange={(e) => { noteRef.current = e.target.value; }}
          />
        </div>,
        cancelText: "Huỷ",
        onConfirm: () => {
          if (!noteRef.current.trim()) {
            error("Vui lòng nhập lý do.");
            return;
          }

          if (!task?._id) {
            error("Không tìm thấy khảo sát. Vui lòng thử lại.");
            return;
          }

          dispatch(cancelTask({ id: task?._id, reason: noteRef.current }))
        }
      });
  }

  useEffect(() => {
    if (taskState.type === "cancelTask") {
      switch (taskState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: "Huỷ khảo sát thành công",
            onConfirm() {
              dispatch(clearTaskState());
              router.push("/schedule")
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Thất bại",
            description: "Huỷ khảo sát thất bại.",
            onConfirm() {
              dispatch(clearTaskState())
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
  }, [taskState])

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Chi tiết lịch trình</h1>
        <p className="text-base text-muted-foreground">Xem lại thông tin chi tiết và kết quả khảo sát tại điểm bán.</p>
        {task?.resurveyRequest?.reason && <p className="text-base font-bold">Lý do: {task?.resurveyRequest?.reason}</p>}
      </div>
      <div className="flex flex-row gap-4 items-center">
        {task?.status === Status.RESURVEY_REQUIRED && <>
          <Button
            disabled={isLoading && isApproved}
            onClick={handleAcceptRequest}
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-500/90 hover:text-white">
            {isLoading && isApproved ? <Spinner className="size-4" /> : <CircleCheckBig className="size-4" />}
            {isLoading && isApproved ? 'Đang chấp nhận yêu cầu...' : 'Chấp nhận yêu cầu'}
          </Button>
          <Button
            disabled={isLoading && isReject}
            onClick={handleRejectRequest}
            variant="outline"
            className="bg-red-500 text-white hover:bg-red-500/90 hover:text-white">
            {isLoading && isReject ? <Spinner className="size-4" /> : <CircleX className="size-4" />}
            {isLoading && isReject ? 'Đang từ chối yêu cầu...' : 'Từ chối yêu cầu'}
          </Button>
        </>}
        <Button
          hidden={task?.status !== "IN_PROGRESS"}
          disabled={isLoading}
          onClick={handleCancelTask}
          variant="outline"
          className="bg-red-500 text-white hover:bg-red-500/90 hover:text-white">
          Huỷ lịch trình
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <Download className="size-4" />
          Xuất PDF
        </Button>
        <Link href="/schedule" className="cursor-pointer">
          <Button variant="outline" onClick={() => dispatch(clearFilter())}>
            <ArrowLeftIcon className="size-4" />
            Quay lại
          </Button>
        </Link>
      </div>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Status } from "@/components/ui/status-badge";
import { useToastContext } from "@/context/ToastContext";
import { getTaskById } from "@/features/schedule/schedule.slice";
import { approveResurveyRequest, rejectResurveyRequest } from "@/features/survey/survey.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { ArrowLeftIcon, CircleCheckBig, CircleX, Download } from "lucide-react";
import Link from "next/link";

export function HeaderDetailSchedule() {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.schedule.task);
  const requestState = useAppSelector((state) => state.survey.requestState);
  const isLoading = requestState.status === 'loading' && requestState.type === 'approveResurveyRequest' || requestState.type === 'rejectResurveyRequest';
  const { error, success } = useToastContext();

  const handleAcceptRequest = async () => {
    await dispatch(approveResurveyRequest(task?.resurveyRequestId ?? ''))
      .unwrap()
      .then(() => {
        dispatch(getTaskById(task?._id ?? ''));
        setTimeout(() => {
          success('Thành công', 'Yêu cầu hỗ trợ đã được chấp nhận');
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
        }, 500);
      })
      .catch((err: any) => {
        const payload = err as any;
        error('Thất bại', payload.message);
      });
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Chi tiết lịch trình</h1>
        <p className="text-base text-muted-foreground">Xem lại thông tin chi tiết và kết quả khảo sát tại điểm bán</p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        {task?.status === Status.RESURVEY_REQUIRED && <>
          <Button
            disabled={isLoading}
            onClick={handleAcceptRequest}
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-500/90 hover:text-white">
            {isLoading ? <Spinner className="size-4" /> : <CircleCheckBig className="size-4" />}
            {isLoading ? 'Đang chấp nhận yêu cầu...' : 'Chấp nhận yêu cầu'}
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleRejectRequest}
            variant="outline"
            className="bg-red-500 text-white hover:bg-red-500/90 hover:text-white">
            {isLoading ? <Spinner className="size-4" /> : <CircleX className="size-4" />}
            {isLoading ? 'Đang từ chối yêu cầu...' : 'Từ chối yêu cầu'}
          </Button>
        </>
        }
        <Button variant="outline">
          <Download className="size-4" />
          Xuất PDF
        </Button>
        <Link href="/schedule" className="cursor-pointer">
          <Button variant="outline">
            <ArrowLeftIcon className="size-4" />
            Quay lại
          </Button>
        </Link>
      </div>
    </div>
  )
}
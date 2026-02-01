"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getSubmissionById, reviewSubmission } from "@/features/submission/submission.slice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleCheckBig } from "lucide-react";
import { getTaskBySubmissionAndSurvey } from "@/features/task/task.slice";
import { getSurveyById } from "@/features/survey/survey.slice";
import { StoreInfo } from "@/components/schedule/common/StoreInfo";
import { AssigneeInfo } from "@/components/schedule/common/AssigneeInfo";
import { ResultServey } from "@/components/schedule/common/ResultServey";
import { SubmissionStatus } from "@/components/pending-review/StatusBadge";
import { useDialogContext } from "@/context/DialogContext";

export default function PendingReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showInfo, showSuccess, showFailed, showLoading } = useDialogContext();

  const submission = useAppSelector((state) => state.submission.submission);
  const task = useAppSelector((state) => state.task.task);
  const requestState = useAppSelector((state) => state.submission.requestState);

  const isLoading =
    requestState.status === "loading" && requestState.type === "getSubmissionById";

  useEffect(() => {
    if (params?.id) {
      dispatch(getSubmissionById(params.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (submission?.surveyId) {
      dispatch(getTaskBySubmissionAndSurvey({ submissionId: submission._id, surveyId: submission.surveyId }));
      dispatch(getSurveyById(submission.surveyId));
    }
  }, [submission?.surveyId, dispatch]);

  const handleApprove = () => {
    showInfo({
      title: "Phê duyệt khảo sát",
      description: "Bạn có chắc chắn muốn phê duyệt khảo sát này không?",
      confirmText: "Đồng ý",
      cancelText: "Hủy",
      onConfirm: () => {
        dispatch(reviewSubmission({ id: submission?._id || '', action: 'APPROVED' }));
      },
      onCancel: () => {
        console.log("Hủy");
      }
    });
  };

  const handleBack = () => {
    router.push("/pending-review");
  };

  useEffect(() => {
    if (!requestState.type) return;
    if (['reviewSubmission'].includes(requestState.type)) {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Phê duyệt khảo sát",
            description: "Phê duyệt khảo sát thành công",
          });
          break;
        case 'failed':
          showFailed({
            title: "Phê duyệt khảo sát",
            description: "Phê duyệt khảo sát thất bại",
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          }); break;
      }
    }
  }, [requestState]);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Chi tiết khảo sát</h1>
          <p className="text-base text-muted-foreground">
            Xem chi tiết khảo sát và các câu hỏi còn thiếu để duyệt
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="size-4" />
            Quay lại
          </Button>
          <Button variant="default" hidden={submission?.status !== SubmissionStatus.PENDING_REVIEW} className="bg-main text-white hover:bg-main/90 hover:text-white" onClick={handleApprove}>
            <CircleCheckBig className="size-4" />
            Phê duyệt
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StoreInfo store={submission?.store} isLoading={isLoading} />
          <AssigneeInfo
            task={task}
            submittedAt={submission?.submittedAt}
            checkinTime={submission?.checkinTime}
            checkoutTime={submission?.checkoutTime} />
        </div>
        <ResultServey />
      </div>
    </div>
  );
}


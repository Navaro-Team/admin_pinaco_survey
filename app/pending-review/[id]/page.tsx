"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearSubmissionState, deleteSubmission, getSubmissionById, restoreSubmission, reviewSubmission } from "@/features/submission/submission.slice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleCheckBig, RotateCcw, Trash2, X } from "lucide-react";
import { getTaskBySubmissionAndSurvey } from "@/features/task/task.slice";
import { getSurveyById } from "@/features/survey/survey.slice";
import { StoreInfo } from "@/components/schedule/common/StoreInfo";
import { AssigneeInfo } from "@/components/schedule/common/AssigneeInfo";
import { ResultSurvey } from "@/components/schedule/common/ResultSurvey";
import { SubmissionStatus } from "@/components/pending-review/StatusBadge";
import { useDialogContext } from "@/context/DialogContext";
import { PhotoCheckIn } from "@/components/schedule/common/PhotoCheckIn";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleReject = () => {
    showInfo({
      title: "Từ chối phê duyệt khảo sát",
      description: "Bạn có muốn từ chối phê duyệt khảo sát này không?",
      confirmText: "Đồng ý",
      cancelText: "Hủy",
      onConfirm: () => {
        dispatch(reviewSubmission({ id: submission?._id || '', action: 'REJECTED' }));
      },
      onCancel: () => {
        console.log("Hủy");
      }
    });
  };

  const handleDelete = () => {
    showInfo({
      title: "Xóa khảo sát",
      description: "Bạn có chắc chắn muốn xóa khảo sát này không? Khảo sát sẽ được chuyển sang trạng thái đã xóa.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm: () => {
        dispatch(deleteSubmission(submission?._id || ''));
      },
      onCancel: () => {
        console.log("Hủy");
      }
    });
  };

  const handleRestore = () => {
    showInfo({
      title: "Khôi phục khảo sát",
      description: "Bạn có chắc chắn muốn khôi phục khảo sát này không?",
      confirmText: "Khôi phục",
      cancelText: "Hủy",
      onConfirm: () => {
        dispatch(restoreSubmission(submission?._id || ''));
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
          if (requestState.data === "APPROVED") {
            showSuccess({
              title: "Phê duyệt khảo sát",
              description: "Phê duyệt khảo sát thành công",
              onConfirm() {
                dispatch(clearSubmissionState());
              },
            });
          } else {
            showSuccess({
              title: "Từ chối phê duyệt khảo sát",
              description: "Từ chối phê duyệt khảo sát thành công",
              onConfirm() {
                dispatch(clearSubmissionState());
              },
            });
          }
          break;
        case 'failed':
          showFailed({
            title: "Phê duyệt khảo sát",
            description: "Cập nhật trạng thái khảo sát thất bại",
            onConfirm() {
              dispatch(clearSubmissionState());
            },
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          }); break;
      }
    } else if (requestState.type === 'deleteSubmission') {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Xóa khảo sát",
            description: "Xóa khảo sát thành công",
            onConfirm() {
              dispatch(clearSubmissionState());
              router.push("/pending-review");
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Xóa khảo sát",
            description: "Xóa khảo sát thất bại",
            onConfirm() {
              dispatch(clearSubmissionState());
            },
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          }); break;
      }
    } else if (requestState.type === 'restoreSubmission') {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Khôi phục khảo sát",
            description: "Khôi phục khảo sát thành công",
            onConfirm() {
              dispatch(clearSubmissionState());
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Khôi phục khảo sát",
            description: "Khôi phục khảo sát thất bại",
            onConfirm() {
              dispatch(clearSubmissionState());
            },
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          }); break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Button variant="default" hidden={submission?.status !== SubmissionStatus.PENDING_REVIEW} className="bg-red-500 text-white hover:bg-red-500/90 hover:text-white" onClick={handleReject}>
            <X />
            Từ chối
          </Button>
          <Button variant="destructive" hidden={submission?.status === SubmissionStatus.DELETED} onClick={handleDelete}>
            <Trash2 className="size-4" />
            Xóa
          </Button>
          <Button variant="outline" hidden={submission?.status !== SubmissionStatus.DELETED} className="border-main text-main hover:bg-main/10 hover:text-main" onClick={handleRestore}>
            <RotateCcw className="size-4" />
            Khôi phục
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StoreInfo store={submission?.store} isLoading={isLoading} />
          <AssigneeInfo
            task={task}
            performedByInfo={submission?.performedByInfo}
            createdAt={submission?.createdAt}
            checkinTime={submission?.checkinTime}
            checkoutTime={submission?.checkoutTime} />
        </div>
        <PhotoCheckIn />
        <ResultSurvey />
      </div>
    </div>
  );
}


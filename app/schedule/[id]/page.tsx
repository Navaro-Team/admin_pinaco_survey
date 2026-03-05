"use client"

import { AssigneeInfo } from "@/components/schedule/common/AssigneeInfo"
import { HeaderDetailSchedule } from "@/components/schedule/common/HeaderDetailSchedule"
import { PhotoCheckIn } from "@/components/schedule/common/PhotoCheckIn"
import { ResultServey } from "@/components/schedule/common/ResultServey"
import { StoreInfo } from "@/components/schedule/common/StoreInfo"
import { getTaskById } from "@/features/schedule/schedule.slice"
import { getSubmissionById, setSubmission } from "@/features/submission/submission.slice"
import { changeSurvey, getSurveyById } from "@/features/survey/survey.slice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const id = params.id as string;
  const task = useAppSelector((state) => state.schedule.task);
  const submission = useAppSelector((state) => state.submission.submission);
  const requestState = useAppSelector((state) => state.schedule.requestState);

  const isLoading =
    requestState.status === "loading" && requestState.type === "getTaskById";

  useEffect(() => {
    if (id) {
      try {
        dispatch(getTaskById(id))
          .unwrap()
          .then((response) => {
            const task = response.data.data;
            console.log(task);
            if (task) {
              if (task.submissionId) {
                dispatch(getSubmissionById(task.submissionId));
              } else {
                dispatch(setSubmission(null))
              }

              if (task.survey.id) {
                dispatch(getSurveyById(task.survey.id));
              } else {
                dispatch(changeSurvey(null))
              }
            }
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        const payload = error as any;
        console.log(payload);
      }
    }
  }, [id, dispatch]);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <HeaderDetailSchedule />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StoreInfo store={task?.store} isLoading={isLoading} />
        <AssigneeInfo
          task={task}
          performedByInfo={submission?.performedByInfo}
          submittedAt={submission?.submittedAt}
          checkinTime={submission?.checkinTime}
          checkoutTime={submission?.checkoutTime} />
      </div>
      <PhotoCheckIn />
      <ResultServey />
    </div>
  )
}
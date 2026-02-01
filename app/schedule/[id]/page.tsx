"use client"

import { AssigneeInfo } from "@/components/schedule/common/AssigneeInfo"
import { HeaderDetailSchedule } from "@/components/schedule/common/HeaderDetailSchedule"
import { ResultServey } from "@/components/schedule/common/ResultServey"
import { StoreInfo } from "@/components/schedule/common/StoreInfo"
import { changeTask, getTaskById } from "@/features/schedule/schedule.slice"
import { getSubmissionById } from "@/features/submission/submission.slice"
import { getSurveyById } from "@/features/survey/survey.slice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const id = params.id as string;
  const tasks = useAppSelector((state) => state.schedule.tasks);
  const task = useAppSelector((state) => state.schedule.task);
  const submission = useAppSelector((state) => state.submission.submission);
  const requestState = useAppSelector((state) => state.schedule.requestState);

  const isLoading =
    requestState.status === "loading" && requestState.type === "getTaskById";

  useEffect(() => {
    if (id) {
      const task = tasks.find((task) => task._id === id);
      if (task) {
        dispatch(changeTask(task));
      } else {
        dispatch(getTaskById(id));
      }
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (task?.submissionId) {
      dispatch(getSubmissionById(task.submissionId));
    }

    if (task?.survey?.id) {
      dispatch(getSurveyById(task.survey.id));
    }
  }, [task, dispatch])

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <HeaderDetailSchedule />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StoreInfo store={task?.store} isLoading={isLoading} />
        <AssigneeInfo
          task={task}
          submittedAt={submission?.submittedAt}
          checkinTime={submission?.checkinTime}
          checkoutTime={submission?.checkoutTime} />
      </div>
      <ResultServey />
    </div>
  )
}
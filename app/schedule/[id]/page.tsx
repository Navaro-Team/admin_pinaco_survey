"use client"

import { AssigneeInfo } from "@/components/schedule/common/AssigneeInfo"
import { HeaderDetailSchedule } from "@/components/schedule/common/HeaderDetailSchedule"
import { ResultServey } from "@/components/schedule/common/ResultServey"
import { StoreInfo } from "@/components/schedule/common/StoreInfo"
import { changeTask, getTaskById } from "@/features/schedule/schedule.slice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const id = searchParams.get('id');
  const tasks = useAppSelector((state) => state.schedule.tasks);

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

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <HeaderDetailSchedule />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StoreInfo />
        <AssigneeInfo />
      </div>
      <ResultServey />
    </div>
  )
}
"use client"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getScheduleStats } from "@/features/task/task.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import CountUp from 'react-countup';

export function SectionCards() {
  const dispatch = useAppDispatch();
  const scheduleStats = useAppSelector((state) => state.task.scheduleStats);
  const user = useAppSelector((state) => state.app.user)
  const role = user?.roles && user?.roles[0]
  const isSale = role?.toLowerCase() === 'sales';

  useEffect(() => {
    dispatch(getScheduleStats({}))
  }, [dispatch])

  return (
    <div className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs px-0 @xl/main:grid-cols-2 ${isSale ? "@5xl/main:grid-cols-3" : "@5xl/main:grid-cols-4"}`}>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Tổng điểm cần khảo sát</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp className="text-yellow-500" end={scheduleStats.totalTasks} duration={4} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Số điểm đã khảo sát</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp className="text-orange-500" end={scheduleStats.totalSubmissions} duration={4} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Số khảo sát đã hoàn thành</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp className="text-green-500" end={scheduleStats.completedSubmissions} duration={2} />
          </CardTitle>
        </CardHeader>
      </Card>

      {!isSale && <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-semibold text-black text-md">Tỷ lệ kiểm tra đối chiếu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp
              className="text-main"
              end={scheduleStats.crossCheckRate * 100}
              duration={6}
            />
            <span className="text-main">%</span>
          </CardTitle>
        </CardHeader>
      </Card>}
    </div>
  );
}
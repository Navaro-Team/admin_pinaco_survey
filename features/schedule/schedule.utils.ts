import { endOfDay, startOfDay } from "date-fns";
import { ScheduleFilter } from "./schedule.slice";

/** Maps the schedule list filter to `/tasks` query params; shared by the table and the Excel export. */
export function getTaskFilterParams(filter: ScheduleFilter) {
  return {
    q: filter.q?.trim() || undefined,
    assigneeId: filter.assigneeId?.trim() || undefined,
    area: filter.areaOrProvince?.trim() || undefined,
    status: filter.status || undefined,
    campaignId: filter.campaignId || undefined,
    dueDateFrom: filter.deadline ? startOfDay(filter.deadline).toISOString() : undefined,
    dueDateTo: filter.deadline ? endOfDay(filter.deadline).toISOString() : undefined,
  };
}

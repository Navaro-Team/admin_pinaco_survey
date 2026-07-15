export interface Task {
  _id: string;
  campaignId: string;
  assignee: any,
  survey: any,
  store: any,
  status: string,
  dueDate: Date,
  submissionId: string,
  submission: any,
  resurveyRequestId: string,
  resurveyRequest: any,
  isResurveyRequested: boolean,
  resurveyStatus: string,
  createdAt: string,
  completedAt: Date,
  updatedAt: Date,
  checkInAssets: any[],
  cancellationReason: string,
  cancelledBy: any,
}

export function parseTask(data: any): Task {
  return {
    _id: data._id,
    campaignId: data.campaignId,
    assignee: data.assignee,
    survey: data.survey,
    store: data.store,
    status: data.status,
    dueDate: data.dueDate,
    submissionId: data.submissionId,
    submission: data.submission,
    resurveyRequestId: data.resurveyRequestId,
    resurveyRequest: data.resurveyRequest,
    isResurveyRequested: data.isResurveyRequested,
    resurveyStatus: data.resurveyStatus,
    createdAt: data.createdAt,
    completedAt: data.completedAt,
    updatedAt: data.updatedAt,
    checkInAssets: data.checkInAssets,
    cancellationReason: data.cancellationReason,
    cancelledBy: data.cancelledBy
  };
}

export function parseTasks(data: any): Task[] {
  if (!Array.isArray(data)) return [];
  return data.map((item: any) => parseTask(item));
}

export function getTaskStatuses(task: Task): string[] {
  const statuses = task.resurveyStatus
    ? [task.status, task.resurveyStatus]
    : [task.status, task.submission?.status];

  return [...new Set(statuses.filter(Boolean))];
}

export function getCheckInAsset(task: Task | null) {
  if (!task || !task.checkInAssets?.length) return [];

  const targetTime = new Date(task.updatedAt).getTime();
  return Object.values(task.checkInAssets.reduce<Record<string, (typeof task.checkInAssets)[number]>>(
    (acc, item) => {
      const type = item.meta?.imageType;
      if (!type) return acc;

      const currentDistance = Math.abs(new Date(item.updatedAt).getTime() - targetTime);
      const existing = acc[type];

      if (!existing || currentDistance < Math.abs(new Date(existing.updatedAt).getTime() - targetTime)) {
        acc[type] = item;
      }

      return acc;
    }, {})
  );
}
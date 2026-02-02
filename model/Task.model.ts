export interface Task {
  _id: string;
  campaignId: string;
  assignee: any,
  survey: any,
  store: any,
  status: string,
  dueDate: Date,
  submissionId: string,
  resurveyRequestId: string,
  resurveyRequest: any,
  isResurveyRequested: boolean,
  resurveyStatus: string,
  createdAt: string,
  completedAt: Date,
  updatedAt: Date,
  checkInAssets: any[]
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
    resurveyRequestId: data.resurveyRequestId,
    resurveyRequest: data.resurveyRequest,
    isResurveyRequested: data.isResurveyRequested,
    resurveyStatus: data.resurveyStatus,
    createdAt: data.createdAt,
    completedAt: data.completedAt,
    updatedAt: data.updatedAt,
    checkInAssets: data.checkInAssets,
  };
}

export function parseTasks(data: any): Task[] {
  if (!Array.isArray(data)) return [];
  return data.map((item: any) => parseTask(item));
}
import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  assigneeId?: string;
  campaignId?: string;
  q?: string;
  area?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

class TaskService {
  async getTasks(params?: GetTasksParams) {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.status) queryParams.status = params.status;
    if (params?.q) queryParams.q = params.q;
    if (params?.assigneeId) queryParams.assigneeId = params.assigneeId;
    if (params?.area) queryParams.area = params.area;
    if (params?.campaignId) queryParams.campaignId = params.campaignId;
    if (params?.dueDateFrom) queryParams.dueDateFrom = params.dueDateFrom;
    if (params?.dueDateTo) queryParams.dueDateTo = params.dueDateTo;

    const response = await clientService.get('/tasks', queryParams);
    return parseCommonHttpResult(response);
  }

  async getTaskById(id: string) {
    const response = await clientService.get(`/tasks/${id}`);
    return parseCommonHttpResult(response);
  }

  async getTaskBySubmissionAndSurvey(params: { submissionId: string, surveyId: string }) {
    const queryParams: Record<string, string> = {};
    if (params.submissionId) queryParams.submissionId = params.submissionId;
    if (params.surveyId) queryParams.surveyId = params.surveyId;
    const response = await clientService.get('/tasks/by-submission-and-survey', queryParams);
    return parseCommonHttpResult(response);
  }

  async createTask(payload: { surveyId: string, assignee: any, storeId: string, campaignId: string, dueDate: string }) {
    const response = await clientService.post('/tasks', payload);
    return parseCommonHttpResult(response);
  }

  async createMultipleTasks(payload: { surveyId: string, campaignId: string, dueDate: string }) {
    const response = await clientService.post('/tasks/assign-from-mappings', payload);
    return parseCommonHttpResult(response);
  }

  async createTasks(payload: { surveyId: string, assignee: any, storeIds: string[], campaignId: string, dueDate: string }) {
    const response = await clientService.post('/tasks/bulk-by-stores', payload);
    return parseCommonHttpResult(response);
  }

  async deleteTask(id: string) {
    const response = await clientService.delete(`/tasks/${id}`, {});
    return parseCommonHttpResult(response);
  }

  async exportTasks(params: Omit<GetTasksParams, 'page' | 'limit'> & { surveyId: string, startDate?: string, endDate?: string }) {
    // Drop empty values so URLSearchParams does not send "undefined"
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    );
    const response = await clientService.get('/tasks/export', queryParams);
    return parseCommonHttpResult(response);
  }


  async cancelTask(payload: { id: string, reason: string }) {
    const response = await clientService.patch(`/tasks/${payload.id}/cancel`, { reason: payload.reason });
    return parseCommonHttpResult(response);
  }

  async reopenTask(payload: { id: string }) {
    const response = await clientService.patch(`/tasks/${payload.id}/reopen`);
    return parseCommonHttpResult(response);
  }


  async reassignTask(payload: { id: string, assigneeId: string }) {
    const response = await clientService.patch(`/tasks/${payload.id}/reassign`, { assigneeId: payload.assigneeId });
    return parseCommonHttpResult(response);
  }

  async getScheduleStats() {
    const response = await clientService.get(`/tasks/schedule-stats`);
    return parseCommonHttpResult(response);
  }
}

export const taskService = new TaskService();
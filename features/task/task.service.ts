import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  assigneeId?: string;
  campaignId?: string;
}

class TaskService {
  async getTasks(params?: GetTasksParams) {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.status) queryParams.status = params.status;
    if (params?.assigneeId) queryParams.assigneeId = params.assigneeId;
    if (params?.campaignId) queryParams.campaignId = params.campaignId;

    const response = await clientService.get('/tasks', queryParams);
    return parseCommonHttpResult(response);
  }

  async getTaskById(id: string) {
    const response = await clientService.get(`/tasks/${id}`);
    return parseCommonHttpResult(response);
  }
}

export const taskService = new TaskService();
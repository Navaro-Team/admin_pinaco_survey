import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class SubmissionService {
  async getSubmissionById(id: string) {
    const response = await clientService.get(`/submissions/${id}`);
    return parseCommonHttpResult(response);
  }

  async getPendingSubmissions(params?: {
    page?: number;
    limit?: number;
    q?: string;
    area?: string;
    status?: string;
    dateRange?: { from?: string; to?: string };
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.q) queryParams.q = params.q;
    if (params?.area) queryParams.area = params.area;
    if (params?.status) queryParams.status = params.status;
    if (params?.dateRange?.from) queryParams.startDate = params.dateRange.from;
    if (params?.dateRange?.to) queryParams.endDate = params.dateRange.to;
    const response = await clientService.get("/submissions", queryParams);
    return parseCommonHttpResult(response);
  }

  async reviewSubmission(payload: { id: string, action: string, note?: string }) {
    const response = await clientService.post(`/submissions/${payload.id}/review`, payload);
    return parseCommonHttpResult(response);
  }

  async exportSubmission() {
    const response = await clientService.get(`/submissions/export`);
    return parseCommonHttpResult(response);
  }
}

export const submissionService = new SubmissionService();
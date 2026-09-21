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

  async exportSubmission(params?: {
    region?: string;
    staff?: string;
    business_type?: string;
    q?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.region) queryParams.region = params.region;
    if (params?.staff) queryParams.staff = params.staff;
    if (params?.business_type) queryParams.business_type = params.business_type;
    if (params?.q) queryParams.q = params.q;
    if (params?.status) queryParams.status = params.status;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    const response = await clientService.get(`/submissions/export`, queryParams);
    return parseCommonHttpResult(response);
  }

  async deleteSubmission(id: string) {
    const response = await clientService.delete(`/submissions/${id}`, {});
    return parseCommonHttpResult(response);
  }

  async restoreSubmission(id: string) {
    const response = await clientService.post(`/submissions/${id}/restore`, {});
    return parseCommonHttpResult(response);
  }
}

export const submissionService = new SubmissionService();
import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class SubmissionService {
  async getSubmissionById(id: string) {
    const response = await clientService.get(`/submissions/${id}`);
    return parseCommonHttpResult(response);
  }

  async getPendingSubmissions(params?: { limit?: number; skip?: number; status?: string }) {
    const queryParams: Record<string, string> = {};
    if (params?.skip) queryParams.skip = params.skip.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.status) queryParams.status = params.status;
    const response = await clientService.get("/submissions", queryParams);
    return parseCommonHttpResult(response);
  }

  async reviewSubmission(payload: { id: string, action: string, note?: string }) {
    const response = await clientService.post(`/submissions/${payload.id}/review`, payload);
    return parseCommonHttpResult(response);
  }
}

export const submissionService = new SubmissionService();
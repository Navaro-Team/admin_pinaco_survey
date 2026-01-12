import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class SubmissionService {
  async getSubmissionById(id: string) {
    const response = await clientService.get(`/submissions/${id}`);
    return parseCommonHttpResult(response);
  }
}

export const submissionService = new SubmissionService();
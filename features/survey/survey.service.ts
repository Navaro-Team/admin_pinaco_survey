import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class SurveyService {
  async getSurveyById(id: string) {
    const response = await clientService.get(`/surveys/${id}`);
    return parseCommonHttpResult(response);
  }

  async approveResurveyRequest(id: string) {
    const response = await clientService.post(`/surveys/resurvey-request/approve`, { id: id });
    return parseCommonHttpResult(response);
  }

  async rejectResurveyRequest(id: string) {
    const response = await clientService.post(`/surveys/resurvey-request/reject`, { id: id });
    return parseCommonHttpResult(response);
  }
}

export const surveyService = new SurveyService();
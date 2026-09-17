import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";
import { OpenQuestion16FilterState } from "./openQuestion16.types";

class OpenQuestion16Service {
  async getReport(filter: OpenQuestion16FilterState) {
    const params: Record<string, string> = {};
    if (filter.campaignId) params.campaignId = filter.campaignId;
    if (filter.startDate) params.startDate = filter.startDate;
    if (filter.endDate) params.endDate = filter.endDate;
    if (filter.province) params.province = filter.province;
    if (filter.storeGroup) params.storeGroup = filter.storeGroup;

    const response = await clientService.get('/report-open-question-16', params);
    return parseCommonHttpResult(response);
  }

  async getFilterOptions() {
    const response = await clientService.get('/report-open-question-16/filters');
    return parseCommonHttpResult(response);
  }
}

export const openQuestion16Service = new OpenQuestion16Service();

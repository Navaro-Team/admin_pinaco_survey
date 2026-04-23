import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

interface GetCampaignsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

class CampaignsService {
  async getCampaigns(params?: GetCampaignsParams) {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.status) queryParams.status = params.status;
    if (params?.search) queryParams.search = params.search;

    const response = await clientService.get('/campaigns', queryParams);
    return parseCommonHttpResult(response);
  }

  async getCampaignStatistics(campaignId: string) {
    const response = await clientService.get(`/campaigns/${campaignId}/statistics`);
    return parseCommonHttpResult(response);
  }

  async getCampaignById(campaignId: string) {
    const response = await clientService.get(`/campaigns/${campaignId}`);
    return parseCommonHttpResult(response);
  }

  async createCampaign(campaign: any) {
    const response = await clientService.post(`/campaigns`, campaign);
    return parseCommonHttpResult(response);
  }

  async updateCampaign(payload: { id: string, data: any }) {
    const response = await clientService.put(`/campaigns/${payload.id}`, payload.data);
    return parseCommonHttpResult(response);
  }

  async deleteCampaign(campaignId: string) {
    const response = await clientService.delete(`/campaigns/${campaignId}`, {});
    return parseCommonHttpResult(response);
  }
}

export const campaignsService = new CampaignsService();
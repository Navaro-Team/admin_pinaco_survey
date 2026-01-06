import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

export interface GetStoresParams {
  page?: number;
  limit?: number;
}
class StoreService {
  async getStores(params: GetStoresParams) {
    const urlParams = new URLSearchParams();
    if (params.page) {
      urlParams.set('page', params.page.toString());
    }
    if (params.limit) {
      urlParams.set('limit', params.limit.toString());
    }
    const queryString = urlParams.toString();
    const response = await clientService.get(`/stores`, queryString);
    return parseCommonHttpResult(response);
  }

  async getStoreById(id: string) {
    const response = await clientService.get(`/stores/${id}`);
    return parseCommonHttpResult(response);
  }

  async createStore(data: any) {
    const response = await clientService.post(`/stores`, data);
    return parseCommonHttpResult(response);
  }

  async updateStore(payload: { id: string, data: any }) {
    const response = await clientService.put(`/stores/${payload.id}`, payload.data);
    return parseCommonHttpResult(response);
  }

  async deleteStore(id: string) {
    const response = await clientService.delete(`/stores/${id}`, {});
    return parseCommonHttpResult(response);
  }
}

export const storeService = new StoreService();
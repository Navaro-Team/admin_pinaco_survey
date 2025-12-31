import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class StoreService {
  async getStores(params: any) {
    const response = await clientService.get(`/stores`, params);
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
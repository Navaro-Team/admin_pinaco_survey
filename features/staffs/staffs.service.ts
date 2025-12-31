import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

export interface GetUsersParams {
  status?: string;
  phone?: string;
}

class StaffsService {
  async getUsers(params?: GetUsersParams) {
    const queryParams: Record<string, string> = {};

    if (params?.status) queryParams.status = params.status;
    if (params?.phone) queryParams.phone = params.phone;

    const response = await clientService.get('/users', queryParams);
    return parseCommonHttpResult(response);
  }

  async getUserById(id: string) {
    const response = await clientService.get(`/users/${id}`);
    return parseCommonHttpResult(response);
  }

  async createUser(data: any) {
    const response = await clientService.post('/users', data);
    return parseCommonHttpResult(response);
  }

  async updateUser(payload: { id: string; data: any }) {
    const response = await clientService.put(`/users/${payload.id}`, payload.data);
    return parseCommonHttpResult(response);
  }

  async deleteUser(id: string) {
    const response = await clientService.delete(`/users/${id}`, {});
    return parseCommonHttpResult(response);
  }
}

export const staffsService = new StaffsService();

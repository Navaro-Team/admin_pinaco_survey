import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

export interface GetUsersParams {
  status?: string;
  phone?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface SearchUsersParams {
  q?: string;
  page?: number;
  limit?: number;
  status?: string;
}

class StaffsService {
  async getUsers(params?: GetUsersParams) {
    const queryParams: Record<string, string> = {};

    if (params?.status) queryParams.status = params.status;
    if (params?.phone) queryParams.phone = params.phone;
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.search) queryParams.search = params.search;

    const response = await clientService.get('/users', queryParams);
    return parseCommonHttpResult(response);
  }

  async searchUsers(params?: SearchUsersParams) {
    const queryParams: Record<string, string> = {};

    if (params?.q) {
      queryParams.q = params.q;
    } else {
      if (params?.limit) queryParams.limit = params.limit.toString();
    }
    
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.status) queryParams.status = params.status;

    const response = await clientService.get('/users/search', queryParams);
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

  async importUsers(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await clientService.upload('/users/import', formData);
    return parseCommonHttpResult(response);
  }
}

export const staffsService = new StaffsService();

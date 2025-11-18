import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";
import { LoginFormData } from "./auth.schema";

class AuthService {
  async login(data: { username: string, password: string }) {
    const response = await clientService.post('/auth/login', data);
    return parseCommonHttpResult(response);
  }

  async logout() {
    const response = await clientService.post('/auth/logout');
    return parseCommonHttpResult(response);
  }
}

export const authService = new AuthService();
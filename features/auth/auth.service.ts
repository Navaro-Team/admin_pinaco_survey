import { HttpService } from "../http/HttpService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

class AuthService {
  async login(data: { email: string, password: string }) {
    const response = await HttpService.doPostRequest('/auth/login', data);
    return parseCommonHttpResult(response);
  }

  async logout() {
    const response = await HttpService.doPostRequest('/auth/logout', "", true);
    return parseCommonHttpResult(response);
  }
}

export const authService = new AuthService();
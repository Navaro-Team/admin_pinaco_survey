import { storage } from "@/lib/storage.util";
import { BaseHttpService } from "./BaseHttpService";
import { cookieUtils } from "@/utils/cookie.util";

export class ClientService extends BaseHttpService {
  constructor() {
    super(process.env.NEXT_PUBLIC_BASE_URL + '/api', 90000);
  }

  private accessToken = () => {
    if (BaseHttpService.isRefreshing) {
      return BaseHttpService.refreshMethod;
    }

    BaseHttpService.isRefreshing = true;
    BaseHttpService.refreshMethod = this.post("/auth/refresh-token", {});
    return BaseHttpService.refreshMethod;
  };
  protected setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { message } = error?.response?.data || {};
        // console.log("http error.response", status, statusText, code, message);
        try {
          if (message === "Access token has expired" &&
            message !== "Refresh token has expired") {
            const response = await this.accessToken();
            if (response.status === 200) {
              const { accessToken } = response?.data?.data?.data || {};
              if (BaseHttpService.isRefreshing) {
                BaseHttpService.isRefreshing = false;
              }
              const config = error.config;
              config.headers["Authorization"] = `Bearer ${accessToken}`;
              return await this.instance.request(config);
            } else {
              // console.log("response", response);
              return Promise.reject(response);
            }
          } else {
            // console.log("🚀 ~ error?.response:", error?.response);
            return Promise.reject({
              status: error?.response?.status || 500,
              statusText: error?.response?.statusText || 'Internal Server Error',
              code: error?.response?.data?.code,
              message: error?.response?.data?.message,
            });
          }
        } catch (error) {
          // console.log("🚀 ~ error:", error);
          return Promise.reject(error);
        }
      }
    );
  }

  private getAuthToken(): string | null {
    return cookieUtils.get('access_token');
  }

  async get(url: string, params?: any, headers?: Record<string, string>) {
    const queryParams = new URLSearchParams(params);
    return this.instance.get(url, { params: queryParams, headers });
  }

  async delete(url: string, data: any, headers?: Record<string, string>) {
    return this.instance.delete(url, { data: data, headers });
  }
}

export const clientService = new ClientService();

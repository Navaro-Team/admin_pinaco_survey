import { storage } from "@/lib/storage.util";
import { BaseHttpService } from "./BaseHttpService";
import { cookieUtils } from "@/utils/cookie.util";

export class ClientService extends BaseHttpService {
  private _storeCache: any = null;

  constructor() {
    super(process.env.NEXT_PUBLIC_BASE_URL + '/api', 30000);
  }

  private getStore() {
    if (this._storeCache) {
      return this._storeCache;
    }
    try {
      const storeModule = require('@/store');
      this._storeCache = storeModule.store;
      return this._storeCache;
    } catch (error) {
      console.error('Error importing store:', error);
      return null;
    }
  }

  private accessToken = () => {
    if (BaseHttpService.isRefreshing) {
      return BaseHttpService.refreshMethod;
    }

    BaseHttpService.isRefreshing = true;
    BaseHttpService.refreshMethod = this.post("/refresh-token", {});
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
        // console.log("http error.response", error?.response);
        try {
          if (error?.response?.data?.message === "Invalid access token!" &&
            error.response?.data?.error !== "Invalid refresh token!") {
            const response = await this.accessToken();
            if (response.status === 200) {
              const { accessToken } = response?.data;
              if (BaseHttpService.isRefreshing) {
                BaseHttpService.isRefreshing = false;
              }
              const config = error.config;
              config.headers["Authorization"] = `Bearer ${accessToken}`;
              return await this.instance.request(config);
            } else {
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

  commonParams() {
    if (typeof window === 'undefined') return null;
    try {
      const store = this.getStore();
      if (!store) {
        return this.getCommonParamsFromLocalStorage();
      }
      const state = store.getState();
      const app = state.app;
      if (!app || !app.store) return null;
      return {
        trans_store: app.store.transStore,
        root_store: app.store.rootStore,
        user_code: app.store.userCode,
      };
    } catch (error) {
      console.error('Error getting commonParams from store:', error);
      return this.getCommonParamsFromLocalStorage();
    }
  }

  private getCommonParamsFromLocalStorage() {
    try {
      const raw = localStorage.getItem('persist:navaro');
      if (!raw) return null;
      const persisted = JSON.parse(raw);
      const app = persisted.app ? JSON.parse(persisted.app) : undefined;
      if (!app || !app.store) return null;
      return {
        trans_store: app.store.transStore,
        root_store: app.store.rootStore,
        user_code: app.store.userCode,
      };
    } catch (error) {
      console.error('Error getting commonParams from localStorage:', error);
      return null;
    }
  }

  async delete(url: string, data: any, headers?: Record<string, string>) {
    return this.instance.delete(url, { data: data, headers });
  }
}

export const clientService = new ClientService();

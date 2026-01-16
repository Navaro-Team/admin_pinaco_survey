import { cookieUtils } from "@/utils/cookie.util";
import { BaseHttpService } from "./BaseHttpService";
import { storage } from "@/lib/storage.util";

export class ServerService extends BaseHttpService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '', 90000);
  }

  protected setupInterceptors(): void {
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
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
        const payload = {
          status: error.response?.status || 500,
          statusText: error.response?.statusText || 'Internal Server Error',
          code: error.response?.data?.code,
          message: error.response?.data?.message,
        };
        return Promise.reject(payload);
      }
    );
  }

  private async getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        return cookieStore.get('access_token')?.value || null;
      } catch (_) {
        this.clearAuthState();
      }
    }
    // Client-side fallback
    return cookieUtils.get('access_token');
  }

  private async clearAuthState(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        try {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          cookieStore.delete('access_token');
          cookieStore.delete('refresh_token');
        } catch (_) { }
      } else {
        cookieUtils.remove('access_token');
        cookieUtils.remove('refresh_token');
      }
    } finally {
      storage.clear();
    }
  }

  async delete(url: string, data: any, _headers?: Record<string, string>) {
    return this.instance.delete(url, { data: data });
  }
}

export const serverService = new ServerService();

import axios, { AxiosInstance, AxiosResponse } from "axios";

export abstract class BaseHttpService {
	protected instance: AxiosInstance;
	protected baseURL: string;
	protected timeout: number;

	constructor(baseURL: string, timeout: number = 30000) {
		this.baseURL = baseURL;
		this.timeout = timeout;
		this.instance = axios.create({
			baseURL: this.baseURL,
			timeout: this.timeout,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		this.setupInterceptors();
	}

	static isRefreshing = false;
	static refreshMethod: Promise<AxiosResponse<any, any>>;

	protected abstract setupInterceptors(): void;

	async get(url: string, params?: any, headers?: Record<string, string>) {
		return this.instance.get(url, { params, headers });
	}

	async post(url: string, data?: any, headers?: Record<string, string>) {
		return this.instance.post(url, data, { headers });
	}

	async put(url: string, data?: any, headers?: Record<string, string>) {
		return this.instance.put(url, data, { headers });
	}

	async patch(url: string, data?: any, headers?: Record<string, string>) {
		return this.instance.patch(url, data, { headers });
	}

	async delete(url: string, data: any, headers?: Record<string, string>) {
		return this.instance.delete(url, { headers });
	}

	async upload(url: string, formData: FormData, headers?: Record<string, string>) {
		return this.instance.post(url, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				...headers,
			},
		});
	}
}

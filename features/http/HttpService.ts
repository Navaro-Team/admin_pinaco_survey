import axios, { AxiosResponse } from "axios"

class HttpService {
  static instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 90000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json'
    }
  })
  static isRefreshing = false
  static refreshMethod: Promise<AxiosResponse<any, any>>

  static commonParams() {
    return {};
  }

  static initialize() {
    HttpService.instance.interceptors.request.use((request) => {
      return request
    })

    HttpService.instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        error.message = error.response?.data.message;
        return Promise.reject(error)
      }
    )
  }

  static async doPostRequest(url: string, data: any, withAccessToken = true) {
    console.warn('HttpService.doPostRequest is deprecated. Use HttpService.client.post() or HttpService.server.post() instead');
    if (!withAccessToken) {
      delete HttpService.instance.defaults.headers['Authorization']
      return HttpService.instance.post(url, data, { headers: { 'x-api-key': '' } })
    } else {
      const params = { ...Object(data), ...this.commonParams() }
      const response = HttpService.instance.post(url, params)
      return response
    }
  }

  static async doGetRequest(url: string, data: any, withAccessToken = true) {
    console.warn('HttpService.doGetRequest is deprecated. Use HttpService.client.get() or HttpService.server.get() instead');
    if (!withAccessToken) {
      delete HttpService.instance.defaults.headers['Authorization']
      return HttpService.instance.get(url, { params: data, headers: { 'x-api-key': '' } })
    } else {
      const params = { ...Object(data), ...this.commonParams() }
      return HttpService.instance.get(url, { params: params })
    }
  }

  static async doPatchRequest(url: string, data: any, withAccessToken = true) {
    console.warn('HttpService.doPatchRequest is deprecated. Use HttpService.client.patch() or HttpService.server.patch() instead');
    if (!withAccessToken) {
      delete HttpService.instance.defaults.headers['Authorization']
      return HttpService.instance.patch(url, data, { headers: { 'x-api-key': '' } })
    } else {
      const params = { ...Object(data), ...this.commonParams() }
      return HttpService.instance.patch(url, params)
    }
  }

  static async doPutRequest(url: string, data: any, withAccessToken = true) {
    console.warn('HttpService.doPutRequest is deprecated. Use HttpService.client.put() or HttpService.server.put() instead');
    if (!withAccessToken) {
      delete HttpService.instance.defaults.headers['Authorization']
      return HttpService.instance.put(url, data, { headers: { 'x-api-key': '' } })
    } else {
      const params = { ...Object(data), ...this.commonParams() }
      return HttpService.instance.put(url, params)
    }
  }

  static async doDeleteRequest(url: string, data: any) {
    console.warn('HttpService.doDeleteRequest is deprecated. Use HttpService.client.delete() or HttpService.server.delete() instead');
    const params = { ...Object(data), ...this.commonParams() }
    return HttpService.instance.delete(url, { data: params, headers: { 'x-api-key': '' } })
  }

  static async doUploadRequest(url: string, data: any) {
    console.warn('HttpService.doUploadRequest is deprecated. Use HttpService.server.upload() instead');
    delete HttpService.instance.defaults.headers["Content-Type"];
    delete HttpService.instance.defaults.headers["Accept"];
    return HttpService.instance.post(url, data, {
      headers: { "Content-Type": "multipart/form-data", Accept: "*/*" },
    });
  }
}

export { HttpService }
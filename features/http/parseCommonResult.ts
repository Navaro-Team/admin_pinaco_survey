import { AxiosResponse } from 'axios'

export const parseCommonHttpResult = (response: AxiosResponse<any, any>) => {
  if ([200, 201, 204].includes(response.status)) {
    return {
      status: response.status,
      statusText: response.statusText,
      code: response.data.code,
      message: response.data.message,
      data: response.data
    }
  }

  return {
    status: response.status,
    statusText: response.statusText,
    code: response.data.code,
    message: response.data.message
  }

}

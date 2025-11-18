import { AxiosResponse } from "axios";
import { NextResponse } from "next/server";

export function responseSuccess(response: AxiosResponse<any, any>) {
  return NextResponse.json({
    status: response?.status,
    statusText: response?.statusText,
    message: response?.data?.message,
    data: response?.data?.data,
    code: response?.data?.code
  }, { status: response?.status });
}

export function missingRequiredFieldsResponse(field: string) {
  return NextResponse.json({
    message: `Missing required fields: ${field}`,
    code: 400,
    statusText: 'Bad Request',
  }, { status: 400 });
}

export function responseFailed(error: any, defaultMessage: string) {
  return NextResponse.json({
    message: error.message || defaultMessage,
    code: error.code || 500,
    statusText: error.statusText || 'Internal Server Error',
  }, { status: error.status || 500 });
}
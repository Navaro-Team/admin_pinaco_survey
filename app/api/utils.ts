import { AxiosResponse } from "axios";
import { NextResponse } from "next/server";

export function responseSuccess(response: AxiosResponse<any, any>) {
  return NextResponse.json({
    status: response?.status,
    statusText: response?.statusText,
    data: response?.data,
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
    code: error.status || 500,
    // statusText: error.statusText || 'Internal Server Error',
  }, { status: error.status || 500 });
}
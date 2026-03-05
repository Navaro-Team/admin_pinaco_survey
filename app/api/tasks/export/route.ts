import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { missingRequiredFieldsResponse, responseFailed, responseSuccess } from "../../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();

    if (!params.get('surveyId')) return missingRequiredFieldsResponse('surveyId');
    if (!params.get('startDate')) return missingRequiredFieldsResponse('startDate');
    if (!params.get('endDate')) return missingRequiredFieldsResponse('endDate');

    urlParams.set('surveyId', params.get('surveyId') ?? '');
    urlParams.set('startDate', params.get('startDate') ?? '');
    urlParams.set('endDate', params.get('endDate') ?? '');

    const queryString = urlParams.toString();
    const response = await serverService.get(`/tasks/export?${queryString}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get tasks export failed');
  }
}
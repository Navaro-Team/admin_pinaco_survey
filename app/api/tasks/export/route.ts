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

    for (const key of [
      'surveyId',
      'startDate',
      'endDate',
      'status',
      'campaignId',
      'assigneeId',
      'q',
      'area',
      'dueDateFrom',
      'dueDateTo',
    ]) {
      const value = params.get(key);
      if (value) urlParams.set(key, value);
    }

    const queryString = urlParams.toString();
    const response = await serverService.get(`/tasks/export?${queryString}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get tasks export failed');
  }
}
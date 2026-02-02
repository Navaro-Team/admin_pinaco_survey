import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { missingRequiredFieldsResponse, responseFailed, responseSuccess } from "../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();

    // Pagination
    if (params.get('page')) {
      urlParams.set('page', params.get('page') ?? '');
    }
    if (params.get('limit')) {
      urlParams.set('limit', params.get('limit') ?? '');
    }

    // Filtering
    if (params.get('status')) {
      urlParams.set('status', params.get('status') ?? '');
    }
    if (params.get('assigneeId')) {
      urlParams.set('assigneeId', params.get('assigneeId') ?? '');
    }
    if (params.get('campaignId')) {
      urlParams.set('campaignId', params.get('campaignId') ?? '');
    }

    const queryString = urlParams.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    const response = await serverService.get(url);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get tasks failed');
  }
}

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const { surveyId, assignee, storeId, campaignId, dueDate } = await request.json();
  try {
    if (!accessToken) throw new Error('No access token');
    if (!surveyId) return missingRequiredFieldsResponse('surveyId')
    if (!assignee) return missingRequiredFieldsResponse('assignee')
    if (!storeId) return missingRequiredFieldsResponse('storeId')
    if (!campaignId) return missingRequiredFieldsResponse('campaignId')
    if (!dueDate) return missingRequiredFieldsResponse('dueDate')

    const payload = {
      surveyId: surveyId.toString(),
      assignee: assignee,
      storeId: storeId.toString(),
      campaignId: campaignId.toString(),
      dueDate: dueDate
    }

    const response = await serverService.post('/tasks', payload);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Create task failed');
  }
}
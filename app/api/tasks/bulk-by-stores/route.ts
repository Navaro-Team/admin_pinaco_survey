import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { missingRequiredFieldsResponse, responseFailed, responseSuccess } from "../../utils";

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const { surveyId, assignee, storeIds, campaignId, dueDate } = await request.json();
  try {
    if (!accessToken) throw new Error('No access token');
    if (!surveyId) return missingRequiredFieldsResponse('surveyId')
    if (!assignee) return missingRequiredFieldsResponse('assignee')
    if (!Array.isArray(storeIds) && storeIds.length > 0) return missingRequiredFieldsResponse('storeIds')
    if (!campaignId) return missingRequiredFieldsResponse('campaignId')
    if (!dueDate) return missingRequiredFieldsResponse('dueDate')

    const payload = {
      surveyId: surveyId.toString(),
      assignee: assignee,
      storeIds: Array.from(storeIds),
      campaignId: campaignId.toString(),
      dueDate: dueDate
    }

    const response = await serverService.post('/tasks/bulk-by-stores', payload);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Create tasks failed');
  }
}
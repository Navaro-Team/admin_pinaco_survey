import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();
    if (params.get('submissionId')) {
      urlParams.set('submissionId', params.get('submissionId') ?? '');
    }
    if (params.get('surveyId')) {
      urlParams.set('surveyId', params.get('surveyId') ?? '');
    }
    
    const queryString = urlParams.toString();
    const response = await serverService.get(`/tasks/by-submission-and-survey?${queryString}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get task by submission and survey failed');
  }
}

